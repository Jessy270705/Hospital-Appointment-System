# Retriving table from csv file
SELECT * FROM studentdetails.`jessy dataset`;

# Inserting data into the jessy dataset
INSERT INTO `studentdetails`.`jessy dataset`
(Hours_Studied, Attendance, Parental_Involvement, Access_to_Resources,
 Extracurricular_Activities, Sleep_Hours, Previous_Scores, Motivation_Level, Internet_Access,Tutoring_Sessions,Family_Income,Teacher_Quality,School_Type,Peer_Influence,Physical_Activity,Learning_Disabilities,Parental_Education_Level,Distance_from_Home,Gender,Exam_Score)
VALUES
(20, 85, 'Medium', 'High', 'Yes', 7, 75, 'High', 'Yes',0,'Low','Medium','Public','Neutral',5,'No','College','Near','Male',95);

# Displaying data who are Studied Hours more than 20
SELECT * FROM `studentdetails`.`jessy dataset` WHERE Hours_Studied > 20;

# Displaying data where Motivation Level is 'High' and also Attendance is more than '80'
SELECT * FROM `studentdetails`.`jessy dataset` WHERE Motivation_Level = 'High' AND Attendance > 80;

# Aggregate Functions 
SELECT 
COUNT(*) AS total_students,
AVG(Hours_Studied) AS avg_study_hours,
AVG(Previous_Scores) AS avg_score,
MAX(Previous_Scores) AS highest_score,
MIN(Previous_Scores) AS lowest_score
FROM `studentdetails`.`jessy dataset` WHERE Motivation_Level = 'High' AND Attendance > 80;

# Displaying jessy dataset where Previous Score > the avg of Previous Score and also Motivation Level is 'High' and Attendance >80 
SELECT *
FROM `studentdetails`.`jessy dataset`
WHERE Previous_Scores > (
    SELECT AVG(Previous_Scores) FROM `studentdetails`.`jessy dataset`)
AND Motivation_Level = 'High' AND Attendance > 80;

# Comparing Hours Studied and Previous Scores
SELECT Hours_Studied, Previous_Scores FROM `studentdetails`.`jessy dataset`;

SELECT Attendance,Exam_Score FROM `studentdetails`.`jessy dataset`;

