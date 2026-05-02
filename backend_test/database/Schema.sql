USE [Resora]
-- ============================================================
-- 1. DEPARTMENTS
-- ============================================================
CREATE TABLE Departments (
    department_id INT          IDENTITY(1,1) NOT NULL,
    name          VARCHAR(100)               NOT NULL,

    CONSTRAINT PK_Departments      PRIMARY KEY (department_id),
    CONSTRAINT UQ_Departments_Name UNIQUE      (name)
);

-- ============================================================
-- 2. TEACHERS (removed is_available)
-- ============================================================
CREATE TABLE Teachers (
    teacher_id    INT          IDENTITY(1,1) NOT NULL,
    name          VARCHAR(100)               NOT NULL,
    department_id INT                        NULL,
    email         VARCHAR(100)               NOT NULL,

    CONSTRAINT PK_Teachers       PRIMARY KEY (teacher_id),
    CONSTRAINT UQ_Teachers_Email UNIQUE      (email),
    CONSTRAINT FK_Teachers_Dept  FOREIGN KEY (department_id)
                                 REFERENCES  Departments(department_id)
                                 ON UPDATE CASCADE ON DELETE SET NULL
);

-- ============================================================
-- 3. STUDENTS
-- ============================================================
CREATE TABLE Students (
    student_id        INT          IDENTITY(1,1) NOT NULL,
    roll_number       VARCHAR(20)                NOT NULL,
    name              VARCHAR(100)               NOT NULL,
    batch_year        SMALLINT                   NOT NULL,
    section           CHAR(2)                    NOT NULL,
    department_id     INT                        NOT NULL,
    enrollment_status VARCHAR(20)                NOT NULL DEFAULT 'Active',
    email             VARCHAR(100)               NOT NULL,

    CONSTRAINT PK_Students         PRIMARY KEY (student_id),
    CONSTRAINT UQ_Students_Roll    UNIQUE      (roll_number),
    CONSTRAINT UQ_Students_Email   UNIQUE      (email),
    CONSTRAINT CHK_Students_Status CHECK       (enrollment_status IN ('Active','Inactive','Graduated')),
    CONSTRAINT FK_Students_Dept    FOREIGN KEY (department_id)
                                   REFERENCES  Departments(department_id)
                                   ON UPDATE CASCADE ON DELETE NO ACTION
);

-- ============================================================
-- 4. ROOMS
-- ============================================================
CREATE TABLE Rooms (
    room_id     INT          IDENTITY(1,1) NOT NULL,
    room_number VARCHAR(3)                 NOT NULL,
    building    VARCHAR(100)               NOT NULL,
    floor       INT                        NOT NULL,
    capacity    INT                        NOT NULL,
    room_type   VARCHAR(20)                NOT NULL,

    CONSTRAINT PK_Rooms       PRIMARY KEY (room_id),
    CONSTRAINT UQ_Rooms_Number UNIQUE     (room_number),
    CONSTRAINT CHK_Rooms_Cap  CHECK       (capacity > 0),
    CONSTRAINT CHK_Rooms_Type CHECK       (room_type IN (
        'Seminar Hall','Class Room','Computer Lab',
        'Robotics Lab','Electrical lab','English Lab'))
);

-- ============================================================
-- 5. COURSES (added teacher_id, fixed cascade)
-- ============================================================
CREATE TABLE Courses (
    course_code   VARCHAR(20)  NOT NULL,
    name          VARCHAR(100) NOT NULL,
    credit_hours  INT          NOT NULL,
    department_id INT          NOT NULL,
    course_type   VARCHAR(10)  NOT NULL,
    semester      INT          NOT NULL,
    teacher_id    INT          NOT NULL,

    CONSTRAINT PK_Courses          PRIMARY KEY (course_code),
    CONSTRAINT CHK_Courses_Credits CHECK       (credit_hours > 0),
    CONSTRAINT CHK_Courses_Type    CHECK       (course_type IN ('Theory','Lab')),
    CONSTRAINT CHK_Courses_Sem     CHECK       (semester BETWEEN 1 AND 8),
    CONSTRAINT FK_Courses_Dept     FOREIGN KEY (department_id)
                                   REFERENCES  Departments(department_id)
                                   ON UPDATE NO ACTION ON DELETE NO ACTION,
    CONSTRAINT FK_Courses_Teacher  FOREIGN KEY (teacher_id)
                                   REFERENCES  Teachers(teacher_id)
                                   ON UPDATE NO ACTION ON DELETE NO ACTION
);

-- ============================================================
-- 6. TIMESLOTS
-- ============================================================
CREATE TABLE TimeSlots (
    slot_id       INT         IDENTITY(1,1) NOT NULL,
    department_id INT                       NOT NULL,
    semester      INT                       NOT NULL,
    course_code   VARCHAR(20)               NOT NULL,
    day           VARCHAR(10)               NOT NULL,
    start_time    TIME                      NOT NULL,
    end_time      TIME                      NOT NULL,

    CONSTRAINT PK_TimeSlots    PRIMARY KEY (slot_id),
    CONSTRAINT UQ_TimeSlots    UNIQUE      (department_id, semester, course_code, day, start_time),
    CONSTRAINT CHK_TS_Day      CHECK       (day IN ('Monday','Tuesday','Wednesday','Thursday','Friday')),
    CONSTRAINT CHK_TS_Times    CHECK       (end_time > start_time),
    CONSTRAINT CHK_TS_Semester CHECK       (semester BETWEEN 1 AND 8),
    CONSTRAINT FK_TS_Dept      FOREIGN KEY (department_id)
                               REFERENCES  Departments(department_id)
                               ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT FK_TS_Course    FOREIGN KEY (course_code)
                               REFERENCES  Courses(course_code)
                               ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- ============================================================
-- 7. SCHEDULES
-- ============================================================
CREATE TABLE Schedules (
    schedule_id   INT      IDENTITY(1,1) NOT NULL,
    course_code   VARCHAR(20)            NOT NULL,
    room_id       INT                    NOT NULL,
    teacher_id    INT                    NOT NULL,
    slot_id       INT                    NOT NULL,
    section       CHAR(2)                NOT NULL,
    batch_year    SMALLINT               NOT NULL,
    department_id INT                    NOT NULL,

    CONSTRAINT PK_Schedules                   PRIMARY KEY (schedule_id),
    CONSTRAINT FK_Schedules_Course            FOREIGN KEY (course_code)
                                              REFERENCES  Courses(course_code)
                                              ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT FK_Schedules_Room              FOREIGN KEY (room_id)
                                              REFERENCES  Rooms(room_id)
                                              ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT FK_Schedules_Teacher           FOREIGN KEY (teacher_id)
                                              REFERENCES  Teachers(teacher_id)
                                              ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT FK_Schedules_Slot              FOREIGN KEY (slot_id)
                                              REFERENCES  TimeSlots(slot_id)
                                              ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT FK_Schedules_Dept              FOREIGN KEY (department_id)
                                              REFERENCES  Departments(department_id)
                                              ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT UQ_Schedules_NoRoomClash       UNIQUE (room_id,    slot_id),
    CONSTRAINT UQ_Schedules_NoTeacherClash    UNIQUE (teacher_id, slot_id),
    CONSTRAINT UQ_Schedules_NoStudentConflict UNIQUE (course_code, section, batch_year, slot_id)
);


-- ============================================================
-- 9. USERS
-- ============================================================
CREATE TABLE Users (
    user_id       INT          IDENTITY(1,1) NOT NULL,
    email         VARCHAR(100)               NOT NULL,
    password_hash VARCHAR(255)               NOT NULL,
    role          VARCHAR(10)                NOT NULL,
    reference_id  INT                       NOT NULL,

    CONSTRAINT PK_Users       PRIMARY KEY (user_id),
    CONSTRAINT UQ_Users_Email UNIQUE      (email),
    CONSTRAINT CHK_Users_Role CHECK       (role IN ('Admin','Teacher','Student','TA'))
);

-- ============================================================
-- 10. LOGIN SESSIONS
-- ============================================================
CREATE TABLE LoginSessions (
    session_id INT          IDENTITY(1,1) NOT NULL,
    user_id    INT                        NOT NULL,
    token      VARCHAR(255)               NOT NULL,
    login_time DATETIME                   NOT NULL DEFAULT GETDATE(),
    expires_at DATETIME                   NOT NULL,
    is_active  BIT                        NOT NULL DEFAULT 1,

    CONSTRAINT PK_LoginSessions       PRIMARY KEY (session_id),
    CONSTRAINT UQ_LoginSessions_Token UNIQUE      (token),
    CONSTRAINT FK_LoginSessions_User  FOREIGN KEY (user_id)
                                      REFERENCES  Users(user_id)
                                      ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE RoomBookings (
    booking_id     INT IDENTITY(1,1) PRIMARY KEY,

    teacher_id     INT NOT NULL,
    room_id        INT NOT NULL,

    room_type      VARCHAR(20) NOT NULL,   -- ✅ NEW

    booking_date   DATE NOT NULL,

    start_time     TIME NOT NULL,
    end_time       TIME NOT NULL,

    purpose        VARCHAR(30) NOT NULL,   -- ✅ NEW

    status         VARCHAR(20) NOT NULL DEFAULT 'Pending',

    requested_at   DATETIME NOT NULL DEFAULT GETDATE(),

    approved_by    INT NULL,

    -- =========================
    -- CONSTRAINTS
    -- =========================

    CONSTRAINT CHK_RoomBooking_Status
    CHECK (status IN ('Pending', 'Approved', 'Rejected')),

    CONSTRAINT CHK_RoomBooking_Purpose
    CHECK (purpose IN (
        'Makeup Class',
        'Assignment Evaluation',
        'Lab Session',
        'Quiz/Test'
    )),

    CONSTRAINT FK_RoomBooking_Teacher
    FOREIGN KEY (teacher_id)
    REFERENCES Teachers(teacher_id),

    CONSTRAINT FK_RoomBooking_Room
    FOREIGN KEY (room_id)
    REFERENCES Rooms(room_id),

    CONSTRAINT FK_RoomBooking_Admin
    FOREIGN KEY (approved_by)
    REFERENCES Users(user_id)
);

-- ============================================================
-- 11. TAs (added teacher_id)
-- ============================================================
CREATE TABLE TAs (
    ta_id         INT          IDENTITY(1,1) NOT NULL,
    roll_number   VARCHAR(20)                NOT NULL,
    name          VARCHAR(100)               NOT NULL,
    email         VARCHAR(100)               NOT NULL,
    department_id INT                        NOT NULL,
    teacher_id    INT                        NOT NULL,

    CONSTRAINT PK_TAs         PRIMARY KEY (ta_id),
    CONSTRAINT UQ_TAs_Email   UNIQUE      (email),
    CONSTRAINT UQ_TAs_Roll    UNIQUE      (roll_number),
    CONSTRAINT FK_TAs_Student FOREIGN KEY (roll_number)
                              REFERENCES  Students(roll_number)
                              ON UPDATE NO ACTION ON DELETE NO ACTION,
    CONSTRAINT FK_TAs_Dept    FOREIGN KEY (department_id)
                              REFERENCES  Departments(department_id)
                              ON UPDATE NO ACTION ON DELETE NO ACTION,
    CONSTRAINT FK_TAs_Teacher FOREIGN KEY (teacher_id)
                              REFERENCES  Teachers(teacher_id)
                              ON UPDATE NO ACTION ON DELETE NO ACTION
);
GO

-- ============================================================
-- TRIGGER: Validate Users.reference_id against role table
-- ============================================================
GO
CREATE  TRIGGER TR_Users_ValidateReferenceId
ON Users
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1 FROM inserted i
        WHERE
            -- Teacher
            (i.role = 'Teacher' AND NOT EXISTS (
                SELECT 1 FROM Teachers WHERE teacher_id = i.reference_id
            ))

            OR

            -- Student
            (i.role = 'Student' AND NOT EXISTS (
                SELECT 1 FROM Students WHERE student_id = i.reference_id
            ))

            OR

            -- TA
            (i.role = 'TA' AND NOT EXISTS (
                SELECT 1 FROM TAs WHERE ta_id = i.reference_id
            ))

            OR

            -- Non-admin must have reference_id
            (i.role <> 'Admin' AND i.reference_id IS NULL)
    )
    BEGIN
        RAISERROR('Invalid reference_id for the given role.', 16, 1);
        ROLLBACK TRANSACTION;
    END
END;
GO

CREATE TRIGGER TR_Students_AutoSection
ON Students
INSTEAD OF INSERT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO Students (
        roll_number,
        name,
        batch_year,
        semester,
        section,
        department_id,
        enrollment_status,
        email
    )
    SELECT
        i.roll_number,
        i.name,
        i.batch_year,
        i.semester,  -- ab tumhari passed value use hogi

        -- section calculation (semester-wise)
        CAST(i.semester AS VARCHAR(1))
        +
        CHAR(
            65 +
            (
                (
                    SELECT COUNT(*)
                    FROM Students s
                    WHERE s.batch_year = i.batch_year
                      AND s.department_id = i.department_id
                      AND s.semester = i.semester
                ) / 20
            )
        ) AS section,

        i.department_id,
        ISNULL(i.enrollment_status, 'Active'),
        i.email

    FROM inserted i;
END;
GO
CREATE OR ALTER TRIGGER TR_Cleanup_RoomBookings
ON RoomBookings
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        DELETE FROM RoomBookings
        WHERE booking_date < CAST(GETDATE() AS DATE);

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;

        -- optional: error throw for debugging
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END;






--! diff kam hainj schema kay sath 
ALTER TABLE Students
ADD semester INT NULL;
GO
-- DROP TRIGGER IF EXISTS TR_Students_AutoSection;
GO
 -- Clear existing data to avoid conflicts with new trigger logic
ALTER TABLE Rooms
ALTER COLUMN room_number VARCHAR(100);
ALTER TABLE Schedules
ALTER COLUMN section VARCHAR(50);
ALTER TABLE Departments
ALTER COLUMN name VARCHAR(100);

ALTER TABLE Teachers
ALTER COLUMN name VARCHAR(150);

ALTER TABLE Courses
ALTER COLUMN name VARCHAR(200);

ALTER TABLE Rooms
ALTER COLUMN room_number VARCHAR(100);
ALTER TABLE Schedules
DROP CONSTRAINT UQ_Schedules_NoStudentConflict;
ALTER TABLE Schedules
ALTER COLUMN section VARCHAR(50);
ALTER TABLE Schedules
ADD CONSTRAINT UQ_Schedules_NoStudentConflict
UNIQUE (
    section,
    slot_id
);
ALTER TABLE Courses
ALTER COLUMN course_code VARCHAR(150);

ALTER TABLE Courses
ALTER COLUMN teacher_id INT NULL;

ALTER TABLE Schedules
ALTER COLUMN teacher_id INT NULL;


-- ALTER TABLE Schedules
-- DROP CONSTRAINT UQ_Schedules_NoTeacherClash;


-- CREATE UNIQUE INDEX UQ_Schedules_NoTeacherClash
-- ON Schedules (teacher_id, slot_id)
-- WHERE teacher_id IS NOT NULL;

-- Drop unique constraint first

USE [Resora]
GO

-- ============================================================
-- COURSES: Make teacher_id NULLABLE
-- ============================================================
ALTER TABLE Courses
ALTER COLUMN teacher_id INT NULL;
GO

-- ============================================================
-- SCHEDULES: Make teacher_id NULLABLE
-- ============================================================
ALTER TABLE Schedules
ALTER COLUMN teacher_id INT NULL;
GO

-- ============================================================
-- SCHEDULES: Drop old teacher clash constraint
-- ============================================================
ALTER TABLE Schedules
DROP CONSTRAINT UQ_Schedules_NoTeacherClash;
GO

-- ============================================================
-- SCHEDULES: Add filtered unique index (only when teacher assigned)
-- ============================================================
CREATE UNIQUE INDEX UQ_Schedules_NoTeacherClash
ON Schedules (teacher_id, slot_id)
WHERE teacher_id IS NOT NULL;
GO
-- 1. Drop constraint (if exists)
IF EXISTS (
    SELECT 1 
    FROM sys.objects 
    WHERE name = 'UQ_Schedules_NoStudentConflict'
)
BEGIN
    ALTER TABLE Schedules
    DROP CONSTRAINT UQ_Schedules_NoStudentConflict;
END
GO

-- 2. Drop column
ALTER TABLE Schedules
DROP COLUMN batch_year;
GO