-- Données de test pour le développement

-- Insérer un thérapeute de test (mot de passe: therapist123)
INSERT OR IGNORE INTO users (email, password, nom, prenom, telephone, role) VALUES 
  ('therapist@example.com', 'therapist123', 'Dubois', 'Marie', '0601020304', 'therapist');

-- Insérer des patients de test (mot de passe: patient123)
INSERT OR IGNORE INTO users (email, password, nom, prenom, telephone, role) VALUES 
  ('patient1@example.com', 'patient123', 'Martin', 'Jean', '0612345678', 'patient'),
  ('patient2@example.com', 'patient123', 'Durand', 'Sophie', '0623456789', 'patient'),
  ('patient3@example.com', 'patient123', 'Bernard', 'Pierre', '0634567890', 'patient');

-- Insérer des créneaux disponibles pour le thérapeute
INSERT OR IGNORE INTO slots (therapist_id, date, start_time, end_time, status) VALUES 
  (1, '2025-11-03', '09:00', '10:00', 'available'),
  (1, '2025-11-03', '10:00', '11:00', 'available'),
  (1, '2025-11-03', '14:00', '15:00', 'available'),
  (1, '2025-11-03', '15:00', '16:00', 'available'),
  (1, '2025-11-04', '09:00', '10:00', 'available'),
  (1, '2025-11-04', '10:00', '11:00', 'available'),
  (1, '2025-11-04', '14:00', '15:00', 'available'),
  (1, '2025-11-05', '09:00', '10:00', 'available'),
  (1, '2025-11-05', '10:00', '11:00', 'available'),
  (1, '2025-11-05', '11:00', '12:00', 'available');
