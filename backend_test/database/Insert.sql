USE Resora;
GO

-- =========================================
-- SAMPLE ACTIVE STUDENTS (20)
-- =========================================

INSERT INTO Students (
    roll_number,
    name,
    batch_year,
    department_id,
    enrollment_status,
    email,
    semester
)
VALUES
('24L-0601','Ali Raza',2024,(SELECT department_id FROM Departments WHERE name = 'BCS'),'Active','24l0601@lhr.nu.edu.pk',4),
('24L-0602','Ahmed Hassan',2024,(SELECT department_id FROM Departments WHERE name = 'BCS'),'Active','24l0602@lhr.nu.edu.pk',4),
('24L-0603','Fatima Khan',2024,(SELECT department_id FROM Departments WHERE name = 'BCS'),'Active','24l0603@lhr.nu.edu.pk',4),
('24L-0604','Ayesha Noor',2024,(SELECT department_id FROM Departments WHERE name = 'BCS'),'Active','24l0604@lhr.nu.edu.pk',4),
('24L-0605','Hamza Tariq',2024,(SELECT department_id FROM Departments WHERE name = 'BCS'),'Active','24l0605@lhr.nu.edu.pk',4),
('23L-1101','Huzaifa Khan',2023,(SELECT department_id FROM Departments WHERE name = 'BSE'),'Active','23l1101@lhr.nu.edu.pk',6),
('23L-1102','Iqra Javed',2023,(SELECT department_id FROM Departments WHERE name = 'BSE'),'Active','23l1102@lhr.nu.edu.pk',6),
('23L-1103','Abdullah Noor',2023,(SELECT department_id FROM Departments WHERE name = 'BSE'),'Active','23l1103@lhr.nu.edu.pk',6),
('23L-1104','Noor Fatima',2023,(SELECT department_id FROM Departments WHERE name = 'BSE'),'Active','23l1104@lhr.nu.edu.pk',6),
('23L-1105','Ayesha Siddiqui',2023,(SELECT department_id FROM Departments WHERE name = 'BSE'),'Active','23l1105@lhr.nu.edu.pk',6),
('22L-2101','Rida Fatima',2022,(SELECT department_id FROM Departments WHERE name = 'BDS'),'Active','22l2101@lhr.nu.edu.pk',8),
('22L-2102','Talha Raza',2022,(SELECT department_id FROM Departments WHERE name = 'BDS'),'Active','22l2102@lhr.nu.edu.pk',8),
('22L-2103','Hira Malik',2022,(SELECT department_id FROM Departments WHERE name = 'BDS'),'Active','22l2103@lhr.nu.edu.pk',8),
('22L-2104','Zain Ali',2022,(SELECT department_id FROM Departments WHERE name = 'BDS'),'Active','22l2104@lhr.nu.edu.pk',8),
('22L-2105','Saif Ahmed',2022,(SELECT department_id FROM Departments WHERE name = 'BDS'),'Active','22l2105@lhr.nu.edu.pk',2),
('21L-3001','Mustafa Ali',2025,(SELECT department_id FROM Departments WHERE name = 'BCS'),'Active','25l3001@lhr.nu.edu.pk',2),
('21L-3002','Sana Javed',2025,(SELECT department_id FROM Departments WHERE name = 'BCS'),'Active','25l3002@lhr.nu.edu.pk',2),
('21L-3003','Bilal Ahmed',2025,(SELECT department_id FROM Departments WHERE name = 'BCS'),'Active','25l3003@lhr.nu.edu.pk',2),
('21L-3004','Dua Khan',2025,(SELECT department_id FROM Departments WHERE name = 'BCS'),'Active','25l3004@lhr.nu.edu.pk',2),
('21L-3005','Areeba Shah',2025,(SELECT department_id FROM Departments WHERE name = 'BCS'),'Active','25l3005@lhr.nu.edu.pk',2);


-- =========================================
-- SAMPLE TAs (5)
-- =========================================

INSERT INTO TAs (
    roll_number,
    name,
    email,
    department_id,
    teacher_id
)
VALUES
('23L-1101','Huzaifa Khan','ta.huzaifa@nu.edu.pk',(SELECT department_id FROM Departments WHERE name = 'BSE'),(SELECT teacher_id FROM Teachers WHERE name = 'Hina I')),
('23L-1102','Iqra Javed','ta.iqra@nu.edu.pk',(SELECT department_id FROM Departments WHERE name = 'BSE'),(SELECT teacher_id FROM Teachers WHERE name = 'A Qadeer')),
('22L-2101','Rida Fatima','ta.rida@nu.edu.pk',(SELECT department_id FROM Departments WHERE name = 'BDS'),(SELECT teacher_id FROM Teachers WHERE name = 'Ali M')),
('21L-3001','Mustafa Ali','ta.mustafa@nu.edu.pk',(SELECT department_id FROM Departments WHERE name = 'BCS'),(SELECT teacher_id FROM Teachers WHERE name = 'Aamir W')),
('21L-3002','Sana Javed','ta.sana@nu.edu.pk',(SELECT department_id FROM Departments WHERE name = 'BCS'),(SELECT teacher_id FROM Teachers WHERE name = 'Farooq Ali'));

GO
