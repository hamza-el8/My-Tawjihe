CREATE DATABASE IF NOT EXISTS mowajih_ai;
USE mowajih_ai;

CREATE TABLE IF NOT EXISTS Admine (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  motDePasse VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Eleve (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  niveau VARCHAR(50) NOT NULL,
  filiere VARCHAR(100),
  ville VARCHAR(100),
  motDePasse VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Parent (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  motDePasse VARCHAR(255) NOT NULL,
  eleveId INT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (eleveId) REFERENCES Eleve(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS Professeur (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  specialite VARCHAR(100),
  motDePasse VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Note (
  id INT AUTO_INCREMENT PRIMARY KEY,
  matiere VARCHAR(100) NOT NULL,
  valeur DECIMAL(5,2) NOT NULL,
  coefficient DECIMAL(3,1) DEFAULT 1,
  periode VARCHAR(50),
  type VARCHAR(50),
  eleveId INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (eleveId) REFERENCES Eleve(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Metier (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(150) NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS Roadmap (
  id INT AUTO_INCREMENT PRIMARY KEY,
  matiereCible VARCHAR(100),
  niveau VARCHAR(50),
  parcours TEXT,
  eleveId INT NOT NULL,
  metierId INT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (eleveId) REFERENCES Eleve(id) ON DELETE CASCADE,
  FOREIGN KEY (metierId) REFERENCES Metier(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS ProfilOnet (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100),
  date DATE,
  seuil DECIMAL(5,2),
  eleveId INT,
  roadmapId INT,
  metierId INT,
  FOREIGN KEY (eleveId) REFERENCES Eleve(id) ON DELETE CASCADE,
  FOREIGN KEY (roadmapId) REFERENCES Roadmap(id) ON DELETE SET NULL,
  FOREIGN KEY (metierId) REFERENCES Metier(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS Exercice (
  id INT AUTO_INCREMENT PRIMARY KEY,
  matiere VARCHAR(100) NOT NULL,
  niveau VARCHAR(50),
  difficulte ENUM('facile','moyen','difficile') DEFAULT 'moyen',
  contenu TEXT NOT NULL,
  correction TEXT,
  professeurId INT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (professeurId) REFERENCES Professeur(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS ResultatExercice (
  id INT AUTO_INCREMENT PRIMARY KEY,
  score DECIMAL(5,2),
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  eleveId INT NOT NULL,
  exerciceId INT NOT NULL,
  FOREIGN KEY (eleveId) REFERENCES Eleve(id) ON DELETE CASCADE,
  FOREIGN KEY (exerciceId) REFERENCES Exercice(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Concours (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(150) NOT NULL,
  datw DATE,
  seuil DECIMAL(5,2),
  description TEXT
);

CREATE TABLE IF NOT EXISTS Annale (
  id INT AUTO_INCREMENT PRIMARY KEY,
  annee INT,
  matiere VARCHAR(100),
  fichier VARCHAR(255),
  concoursId INT,
  FOREIGN KEY (concoursId) REFERENCES Concours(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS Notification (
  id INT AUTO_INCREMENT PRIMARY KEY,
  contenu TEXT NOT NULL,
  dateEnvoi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  type VARCHAR(50),
  lu BOOLEAN DEFAULT FALSE,
  eleveId INT,
  admineId INT,
  FOREIGN KEY (eleveId) REFERENCES Eleve(id) ON DELETE CASCADE,
  FOREIGN KEY (admineId) REFERENCES Admine(id) ON DELETE SET NULL
);

-- Seed data
INSERT INTO Admine (nom, email, motDePasse) VALUES
('Admin Principal', 'admin@mowajih.ma', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

INSERT INTO Eleve (nom, email, niveau, filiere, ville, motDePasse) VALUES
('Yassine Benali', 'yassine@test.ma', 'Terminale', 'Sciences Maths', 'Casablanca', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('Fatima Zahra', 'fatima@test.ma', '2ème Bac', 'Sciences Physiques', 'Rabat', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

INSERT INTO Professeur (nom, email, specialite, motDePasse) VALUES
('Prof. Hassan', 'hassan@test.ma', 'Mathématiques', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

INSERT INTO Parent (nom, email, motDePasse, eleveId) VALUES
('Mohamed Benali', 'parent@test.ma', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1);

INSERT INTO Note (matiere, valeur, coefficient, periode, type, eleveId) VALUES
('Mathématiques', 16.5, 3, 'S1', 'Contrôle', 1),
('Physique', 14.0, 2, 'S1', 'Examen', 1),
('Français', 13.5, 2, 'S1', 'Contrôle', 1),
('Mathématiques', 12.0, 3, 'S1', 'Contrôle', 2),
('Chimie', 15.5, 2, 'S1', 'Examen', 2);

INSERT INTO Metier (nom, description) VALUES
('Ingénieur Informatique', 'Développement de logiciels et systèmes informatiques'),
('Médecin', 'Diagnostic et traitement des maladies'),
('Architecte', 'Conception et planification de bâtiments');

INSERT INTO Exercice (matiere, niveau, difficulte, contenu, correction, professeurId) VALUES
('Mathématiques', 'Terminale', 'moyen', 'Résoudre: 2x² + 5x - 3 = 0', 'Discriminant: 25+24=49. x1=(−5+7)/4=0.5, x2=(−5−7)/4=−3', 1),
('Physique', '2ème Bac', 'facile', 'Un objet de masse 2kg est soumis à une force de 10N. Calculer l\'accélération.', 'F=ma → a=F/m=10/2=5 m/s²', 1);

INSERT INTO Concours (nom, datw, seuil, description) VALUES
('CNC 2026', '2026-06-15', 14.0, 'Concours National Commun pour les CPGE'),
('ENSA 2026', '2026-07-01', 13.5, 'École Nationale des Sciences Appliquées');

INSERT INTO Annale (annee, matiere, fichier, concoursId) VALUES
(2025, 'Mathématiques', 'cnc_2025_maths.pdf', 1),
(2024, 'Physique', 'cnc_2024_physique.pdf', 1);
