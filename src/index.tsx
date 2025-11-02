import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

type Bindings = {
  DB: D1Database;
}

type Variables = {
  user: any;
}

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()

// Enable CORS
app.use('/api/*', cors())

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))

// Middleware pour vérifier l'authentification
const authMiddleware = async (c: any, next: any) => {
  const token = c.req.header('Authorization')?.replace('Bearer ', '')
  
  if (!token) {
    return c.json({ error: 'Non autorisé' }, 401)
  }

  try {
    // Dans un environnement de production, utilisez JWT
    // Pour la démo, on utilise simplement l'ID utilisateur
    const userId = parseInt(token)
    const user = await c.env.DB.prepare('SELECT id, email, nom, prenom, role FROM users WHERE id = ?')
      .bind(userId)
      .first()

    if (!user) {
      return c.json({ error: 'Utilisateur non trouvé' }, 401)
    }

    c.set('user', user)
    await next()
  } catch (error) {
    return c.json({ error: 'Token invalide' }, 401)
  }
}

// ==================== API AUTHENTICATION ====================

// Login
app.post('/api/auth/login', async (c) => {
  try {
    const { email, password } = await c.req.json()
    
    const user = await c.env.DB.prepare(
      'SELECT id, email, nom, prenom, telephone, role FROM users WHERE email = ? AND password = ?'
    ).bind(email, password).first()

    if (!user) {
      return c.json({ error: 'Email ou mot de passe incorrect' }, 401)
    }

    // Dans un environnement de production, utilisez un vrai JWT
    // Pour la démo, on retourne simplement l'ID utilisateur comme token
    return c.json({
      success: true,
      token: user.id.toString(),
      user: {
        id: user.id,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
        telephone: user.telephone,
        role: user.role
      }
    })
  } catch (error) {
    return c.json({ error: 'Erreur lors de la connexion' }, 500)
  }
})

// Register
app.post('/api/auth/register', async (c) => {
  try {
    const { email, password, nom, prenom, telephone, role } = await c.req.json()
    
    // Vérifier si l'email existe déjà
    const existingUser = await c.env.DB.prepare(
      'SELECT id FROM users WHERE email = ?'
    ).bind(email).first()

    if (existingUser) {
      return c.json({ error: 'Cet email est déjà utilisé' }, 400)
    }

    // Insérer le nouvel utilisateur
    const result = await c.env.DB.prepare(
      'INSERT INTO users (email, password, nom, prenom, telephone, role) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(email, password, nom, prenom, telephone || null, role).run()

    return c.json({
      success: true,
      message: 'Inscription réussie',
      userId: result.meta.last_row_id
    })
  } catch (error) {
    return c.json({ error: 'Erreur lors de l\'inscription' }, 500)
  }
})

// Get current user
app.get('/api/auth/me', authMiddleware, async (c) => {
  const user = c.get('user')
  return c.json({ user })
})

// ==================== API SLOTS (CRÉNEAUX) ====================

// Get all available slots
app.get('/api/slots/available', async (c) => {
  try {
    const date = c.req.query('date')
    let query = 'SELECT s.*, u.nom, u.prenom FROM slots s JOIN users u ON s.therapist_id = u.id WHERE s.status = \'available\''
    
    if (date) {
      query += ' AND s.date = ?'
      const slots = await c.env.DB.prepare(query).bind(date).all()
      return c.json({ slots: slots.results })
    } else {
      const slots = await c.env.DB.prepare(query).all()
      return c.json({ slots: slots.results })
    }
  } catch (error) {
    return c.json({ error: 'Erreur lors de la récupération des créneaux' }, 500)
  }
})

// Get therapist slots
app.get('/api/slots/therapist', authMiddleware, async (c) => {
  try {
    const user = c.get('user')
    
    if (user.role !== 'therapist') {
      return c.json({ error: 'Accès refusé' }, 403)
    }

    const date = c.req.query('date')
    let query = 'SELECT * FROM slots WHERE therapist_id = ?'
    
    if (date) {
      query += ' AND date = ? ORDER BY date, start_time'
      const slots = await c.env.DB.prepare(query).bind(user.id, date).all()
      return c.json({ slots: slots.results })
    } else {
      query += ' ORDER BY date, start_time'
      const slots = await c.env.DB.prepare(query).bind(user.id).all()
      return c.json({ slots: slots.results })
    }
  } catch (error) {
    return c.json({ error: 'Erreur lors de la récupération des créneaux' }, 500)
  }
})

// Create slot (therapist only)
app.post('/api/slots', authMiddleware, async (c) => {
  try {
    const user = c.get('user')
    
    if (user.role !== 'therapist') {
      return c.json({ error: 'Seul un thérapeute peut créer des créneaux' }, 403)
    }

    const { date, start_time, end_time } = await c.req.json()
    
    // Vérifier qu'il n'y a pas de conflit
    const conflict = await c.env.DB.prepare(
      'SELECT id FROM slots WHERE therapist_id = ? AND date = ? AND ((start_time < ? AND end_time > ?) OR (start_time < ? AND end_time > ?) OR (start_time >= ? AND end_time <= ?))'
    ).bind(user.id, date, start_time, start_time, end_time, end_time, start_time, end_time).first()

    if (conflict) {
      return c.json({ error: 'Ce créneau chevauche un créneau existant' }, 400)
    }

    const result = await c.env.DB.prepare(
      'INSERT INTO slots (therapist_id, date, start_time, end_time, status) VALUES (?, ?, ?, ?, \'available\')'
    ).bind(user.id, date, start_time, end_time).run()

    return c.json({
      success: true,
      slotId: result.meta.last_row_id
    })
  } catch (error) {
    return c.json({ error: 'Erreur lors de la création du créneau' }, 500)
  }
})

// Delete slot (therapist only)
app.delete('/api/slots/:id', authMiddleware, async (c) => {
  try {
    const user = c.get('user')
    const slotId = c.req.param('id')
    
    if (user.role !== 'therapist') {
      return c.json({ error: 'Accès refusé' }, 403)
    }

    // Vérifier que le créneau appartient au thérapeute
    const slot = await c.env.DB.prepare(
      'SELECT id, status FROM slots WHERE id = ? AND therapist_id = ?'
    ).bind(slotId, user.id).first()

    if (!slot) {
      return c.json({ error: 'Créneau non trouvé' }, 404)
    }

    if (slot.status === 'booked') {
      return c.json({ error: 'Impossible de supprimer un créneau déjà réservé' }, 400)
    }

    await c.env.DB.prepare('DELETE FROM slots WHERE id = ?').bind(slotId).run()

    return c.json({ success: true })
  } catch (error) {
    return c.json({ error: 'Erreur lors de la suppression du créneau' }, 500)
  }
})

// ==================== API APPOINTMENTS (RENDEZ-VOUS) ====================

// Get patient appointments
app.get('/api/appointments/patient', authMiddleware, async (c) => {
  try {
    const user = c.get('user')
    
    if (user.role !== 'patient') {
      return c.json({ error: 'Accès refusé' }, 403)
    }

    const appointments = await c.env.DB.prepare(`
      SELECT a.*, u.nom as therapist_nom, u.prenom as therapist_prenom, u.telephone as therapist_telephone
      FROM appointments a
      JOIN users u ON a.therapist_id = u.id
      WHERE a.patient_id = ?
      ORDER BY a.date DESC, a.start_time DESC
    `).bind(user.id).all()

    return c.json({ appointments: appointments.results })
  } catch (error) {
    return c.json({ error: 'Erreur lors de la récupération des rendez-vous' }, 500)
  }
})

// Get therapist appointments
app.get('/api/appointments/therapist', authMiddleware, async (c) => {
  try {
    const user = c.get('user')
    
    if (user.role !== 'therapist') {
      return c.json({ error: 'Accès refusé' }, 403)
    }

    const appointments = await c.env.DB.prepare(`
      SELECT a.*, u.nom as patient_nom, u.prenom as patient_prenom, u.telephone as patient_telephone, u.email as patient_email
      FROM appointments a
      JOIN users u ON a.patient_id = u.id
      WHERE a.therapist_id = ?
      ORDER BY a.date DESC, a.start_time DESC
    `).bind(user.id).all()

    return c.json({ appointments: appointments.results })
  } catch (error) {
    return c.json({ error: 'Erreur lors de la récupération des rendez-vous' }, 500)
  }
})

// Book appointment (patient only)
app.post('/api/appointments', authMiddleware, async (c) => {
  try {
    const user = c.get('user')
    
    if (user.role !== 'patient') {
      return c.json({ error: 'Seul un patient peut prendre rendez-vous' }, 403)
    }

    const { slot_id } = await c.req.json()
    
    // Vérifier que le créneau existe et est disponible
    const slot = await c.env.DB.prepare(
      'SELECT * FROM slots WHERE id = ? AND status = \'available\''
    ).bind(slot_id).first()

    if (!slot) {
      return c.json({ error: 'Ce créneau n\'est pas disponible' }, 400)
    }

    // Créer le rendez-vous
    const result = await c.env.DB.prepare(
      'INSERT INTO appointments (slot_id, patient_id, therapist_id, date, start_time, end_time, status) VALUES (?, ?, ?, ?, ?, ?, \'confirmed\')'
    ).bind(slot_id, user.id, slot.therapist_id, slot.date, slot.start_time, slot.end_time).run()

    // Mettre à jour le statut du créneau
    await c.env.DB.prepare(
      'UPDATE slots SET status = \'booked\' WHERE id = ?'
    ).bind(slot_id).run()

    return c.json({
      success: true,
      appointmentId: result.meta.last_row_id
    })
  } catch (error) {
    return c.json({ error: 'Erreur lors de la réservation' }, 500)
  }
})

// Cancel appointment
app.delete('/api/appointments/:id', authMiddleware, async (c) => {
  try {
    const user = c.get('user')
    const appointmentId = c.req.param('id')
    
    // Récupérer le rendez-vous
    const appointment = await c.env.DB.prepare(
      'SELECT * FROM appointments WHERE id = ? AND (patient_id = ? OR therapist_id = ?)'
    ).bind(appointmentId, user.id, user.id).first()

    if (!appointment) {
      return c.json({ error: 'Rendez-vous non trouvé' }, 404)
    }

    // Annuler le rendez-vous
    await c.env.DB.prepare(
      'UPDATE appointments SET status = \'cancelled\' WHERE id = ?'
    ).bind(appointmentId).run()

    // Libérer le créneau
    await c.env.DB.prepare(
      'UPDATE slots SET status = \'available\' WHERE id = ?'
    ).bind(appointment.slot_id).run()

    return c.json({ success: true })
  } catch (error) {
    return c.json({ error: 'Erreur lors de l\'annulation' }, 500)
  }
})

// ==================== HTML PAGES ====================

// Page d'accueil
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thérapie Sensori-Motrice - Réservation</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    </head>
    <body class="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        <div id="app">
            <!-- Page de chargement -->
            <div class="flex items-center justify-center min-h-screen">
                <div class="text-center">
                    <i class="fas fa-spinner fa-spin text-4xl text-indigo-600 mb-4"></i>
                    <p class="text-gray-600">Chargement...</p>
                </div>
            </div>
        </div>
        
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="/static/app.js"></script>
    </body>
    </html>
  `)
})

export default app
