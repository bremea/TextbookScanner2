# Textbook Scanner

### Demo SQL

```sql
CREATE TABLE `students` (
	`id` MEDIUMINT(20) NOT NULL, 
	`firstName` VARCHAR(80) NOT NULL , 
	`lastName` VARCHAR(80) NOT NULL, 
	PRIMARY KEY (`id`)
) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_bin';

CREATE TABLE `courses` (
	`id` INT(20) NOT NULL,
	`name` VARCHAR(1024) NOT NULL,
	PRIMARY KEY (`id`)
) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_bin';

CREATE TABLE `textbooks` (
	`id` INT(20) NOT NULL AUTO_INCREMENT, 
	`name` VARCHAR(1024) NOT NULL, 
	`isbn13` BIGINT(20), 
	`barcode` BIGINT(20), 
	`course` INT(20) NOT NULL, 
	PRIMARY KEY (`id`) 
) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_bin';

CREATE TABLE `studentCourses` (
	`studentId` INT(20) NOT NULL,
	`courseId` INT(20) NOT NULL
);

CREATE TABLE `studentTextbooks` (
    `studentId` INT(20) NOT NULL,
    `textbookId` INT(20) NOT NULL,
    `returned` BOOLEAN NOT NULL,
    `scanner` VARCHAR(256),
    `updateTime` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_bin';

INSERT INTO students (id, firstName, lastName) VALUES (243780, "Brett", "Meadows"), (243781, "Grant", "Meadows");

INSERT INTO courses (id, name) VALUES (251, "AP Statistics"), (470, "AP Psychology"), (395, "Forensic Science");

INSERT INTO studentCourses (studentId, courseId) VALUES (243780, 251), (243780, 470), (243780, 395);

INSERT INTO textbooks (name, isbn13, barcode, course) VALUES ("Stats: Modeling the World
", 9780134685762, 9780134685762, 251), ("Forensic Science: Fundamentals and Investigations 2012 Update", 9780538731553, 9780538731553, 395), ("Myers' Psychology for AP®
", 9781429244367, 9781429244367, 470);

INSERT INTO studentTextbooks (studentId, textbookId, returned, scanner) VALUES (243780, 1, FALSE, "Mr. Fan"), (243780, 2, FALSE, "Mr. Fan"), (243780, 3, FALSE, "Mr. Fan");
```