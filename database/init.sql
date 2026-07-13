-- Criar banco de dados se não existir
IF DB_ID('blog_educacional') IS NULL
BEGIN
    CREATE DATABASE blog_educacional;
END
GO

-- Usar o banco de dados
USE blog_educacional;
GO

-- Criar tabela Aulas se não existir
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Aulas')
BEGIN
    CREATE TABLE Aulas (
        idAula INT IDENTITY(1,1) PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        conteudo VARCHAR(MAX) NOT NULL,
        idProfessor INT NOT NULL,
        idMateria INT NOT NULL,
        dataPublicacao DATETIME DEFAULT GETDATE()
    );
END
GO

-- Criar tabela Professores se não existir
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Professores')
BEGIN
    CREATE TABLE Professores (
        idProfessor INT IDENTITY(1,1) PRIMARY KEY,
        nome VARCHAR(255) NOT NULL
    );
END
GO

-- Criar tabela Materias se não existir
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Materias')
BEGIN
    CREATE TABLE Materias (
        idMateria INT IDENTITY(1,1) PRIMARY KEY,
        nome VARCHAR(255) NOT NULL
    );
END
GO

-- Inserir dados de exemplo se as tabelas estiverem vazias
IF NOT EXISTS (SELECT 1 FROM Professores)
BEGIN
    INSERT INTO Professores (nome) VALUES ('Prof. João');
    INSERT INTO Professores (nome) VALUES ('Prof. Maria');
END
GO

IF NOT EXISTS (SELECT 1 FROM Materias)
BEGIN
    INSERT INTO Materias (nome) VALUES ('Matemática');
    INSERT INTO Materias (nome) VALUES ('Português');
    INSERT INTO Materias (nome) VALUES ('História');
END
GO
