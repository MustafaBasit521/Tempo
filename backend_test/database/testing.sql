SELECT d.*
FROM Departments d
JOIN Students s 
  ON d.department_id = s.department_id
WHERE s.student_id = 1032;

SELECT student_id, department_id 
FROM Students 
WHERE student_id = 1027;

SELECT DISTINCT *
FROM Schedules;



SELECT s.*
FROM Schedules s
WHERE s.section = '6A';