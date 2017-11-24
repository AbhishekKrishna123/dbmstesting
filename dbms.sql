-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Nov 24, 2017 at 01:52 PM
-- Server version: 10.1.19-MariaDB
-- PHP Version: 5.6.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dbms`
--

-- --------------------------------------------------------

--
-- Table structure for table `company`
--

CREATE TABLE `company` (
  `CompanyID` int(11) NOT NULL,
  `CompanyName` varchar(255) DEFAULT NULL,
  `Details` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `company`
--

INSERT INTO `company` (`CompanyID`, `CompanyName`, `Details`) VALUES
(14, 'Goldman Sachs', 'Money'),
(15, 'GE Digital', 'No Money');

-- --------------------------------------------------------

--
-- Table structure for table `department`
--

CREATE TABLE `department` (
  `DepartmentID` int(11) NOT NULL,
  `Name` varchar(255) DEFAULT NULL,
  `Code` varchar(255) DEFAULT NULL,
  `HOD` varchar(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `department`
--

INSERT INTO `department` (`DepartmentID`, `Name`, `Code`, `HOD`) VALUES
(1, 'Aerospace Engineering', 'ASE', NULL),
(2, 'Biotechnology', 'BT', NULL),
(3, 'Chemical Engineering', 'CHE', NULL),
(4, 'Civil Engineering', 'CV', NULL),
(5, 'Computer Science and Engineering', 'CSE', NULL),
(6, 'Electrical and Electronics Engineering', 'EEE', NULL),
(7, 'Electronics and Communication Engineering', 'ECE', NULL),
(8, 'Electronics and Instrumentation Engineering', 'EIE', NULL),
(9, 'Industrial Engineering and Management', 'IEM', NULL),
(10, 'Information Science and Engineering', 'ISE', NULL),
(11, 'Master of Computer Applications', 'MCA', NULL),
(12, 'Mechnical Engineering', 'ME', NULL),
(13, 'Telecommunication Engineering', 'TE', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `eligibledepartments`
--

CREATE TABLE `eligibledepartments` (
  `DepartmentID` int(11) NOT NULL,
  `TestID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `eligibledepartments`
--

INSERT INTO `eligibledepartments` (`DepartmentID`, `TestID`) VALUES
(5, 12),
(5, 13),
(5, 14),
(6, 12),
(6, 13),
(6, 14),
(7, 13);

-- --------------------------------------------------------

--
-- Table structure for table `employee`
--

CREATE TABLE `employee` (
  `EmployeeID` int(11) NOT NULL,
  `CompanyID` int(11) NOT NULL,
  `Name` varchar(255) DEFAULT NULL,
  `EmailID` varchar(255) DEFAULT NULL,
  `MobileNumber` int(11) DEFAULT NULL,
  `Designation` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `faculty`
--

CREATE TABLE `faculty` (
  `FacultyID` varchar(11) NOT NULL,
  `DepartmentID` int(11) NOT NULL,
  `Name` varchar(255) DEFAULT NULL,
  `EmailID` varchar(255) DEFAULT NULL,
  `MobileNumber` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `offer`
--

CREATE TABLE `offer` (
  `USN` varchar(15) NOT NULL,
  `TestID` int(11) NOT NULL,
  `Location` varchar(255) DEFAULT NULL,
  `Compensaation` int(11) DEFAULT NULL,
  `Profile` varchar(255) DEFAULT NULL,
  `Details` varchar(255) DEFAULT NULL,
  `Accepted` varchar(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `register`
--

CREATE TABLE `register` (
  `USN` varchar(15) NOT NULL,
  `TestID` int(11) NOT NULL,
  `Selected` varchar(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `register`
--

INSERT INTO `register` (`USN`, `TestID`, `Selected`) VALUES
('1RV15CS013', 12, NULL),
('1RV15CS013', 13, 'YES'),
('1RV15CS013', 14, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('ZGSTgECKtr0w-O53J99y_uC3YjlOsA-K', 1511614345, '{"cookie":{"originalMaxAge":null,"expires":null,"httpOnly":true,"path":"/"},"username":"csespc001","role":3}'),
('yDnGVT8hCnfmzDY6faYFAsf_xiyXHKky', 1511608695, '{"cookie":{"originalMaxAge":null,"expires":null,"httpOnly":true,"path":"/"},"username":"csespc001","role":3}');

-- --------------------------------------------------------

--
-- Table structure for table `spc`
--

CREATE TABLE `spc` (
  `USN` varchar(15) NOT NULL,
  `DepartmentID` int(11) NOT NULL,
  `username` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `spc`
--

INSERT INTO `spc` (`USN`, `DepartmentID`, `username`) VALUES
('1RV15CS013', 5, 'csespc001');

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `USN` varchar(15) NOT NULL,
  `FirstName` varchar(255) DEFAULT NULL,
  `MiddleName` varchar(255) DEFAULT NULL,
  `LastName` varchar(255) DEFAULT NULL,
  `DOB` date DEFAULT NULL,
  `EmailID` varchar(255) DEFAULT NULL,
  `MobileNumber` varchar(10) NOT NULL,
  `Address` varchar(255) DEFAULT NULL,
  `Gender` varchar(255) DEFAULT NULL,
  `Department` int(11) DEFAULT NULL,
  `Section` varchar(255) DEFAULT NULL,
  `StudentType` varchar(255) DEFAULT NULL,
  `DiplomaStudent` varchar(3) DEFAULT NULL,
  `Semester` int(11) DEFAULT NULL,
  `Marks10th` double DEFAULT NULL,
  `Marks12th` double DEFAULT NULL,
  `Board10th` double DEFAULT NULL,
  `Board12th` double DEFAULT NULL,
  `SGPA1` double DEFAULT NULL,
  `SGPA2` double DEFAULT NULL,
  `SGPA3` double DEFAULT NULL,
  `SGPA4` double DEFAULT NULL,
  `SGPA5` double DEFAULT NULL,
  `SGPA6` double DEFAULT NULL,
  `SGPA7` double DEFAULT NULL,
  `SGPA8` double DEFAULT NULL,
  `CGPA` double DEFAULT NULL,
  `Password` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`USN`, `FirstName`, `MiddleName`, `LastName`, `DOB`, `EmailID`, `MobileNumber`, `Address`, `Gender`, `Department`, `Section`, `StudentType`, `DiplomaStudent`, `Semester`, `Marks10th`, `Marks12th`, `Board10th`, `Board12th`, `SGPA1`, `SGPA2`, `SGPA3`, `SGPA4`, `SGPA5`, `SGPA6`, `SGPA7`, `SGPA8`, `CGPA`, `Password`) VALUES
('1RV15CS013', 'Aditya', NULL, 'Giridharan', '1997-09-07', 'aditya.giridharan@gmail.com', '8861162591', 'A4 1203 ELITA PROMENADE, 18TH MAIN, J.P NAGAR 7TH PHASE', 'Male', 5, 'A', 'UG', 'No', 5, 98, 98, NULL, NULL, 9, 9, 9, 9, NULL, NULL, NULL, NULL, 9.57, 'password1');

-- --------------------------------------------------------

--
-- Table structure for table `test`
--

CREATE TABLE `test` (
  `TestID` int(11) NOT NULL,
  `CompanyID` int(11) NOT NULL,
  `Name` varchar(255) DEFAULT NULL,
  `TestDate` date DEFAULT NULL,
  `TestTime` time DEFAULT NULL,
  `Location` varchar(255) DEFAULT NULL,
  `Details` varchar(255) DEFAULT NULL,
  `CutOffGPA` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `test`
--

INSERT INTO `test` (`TestID`, `CompanyID`, `Name`, `TestDate`, `TestTime`, `Location`, `Details`, `CutOffGPA`) VALUES
(12, 14, 'GS 1', '2017-11-30', '18:14:00', 'Lol', 'lol', '7'),
(13, 15, 'GE Round 1', '2017-11-07', '18:55:00', 'cog', 'none', '7'),
(14, 14, 'GS Round 2', '2017-11-24', '18:08:00', 'Here', 'None', '6');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `username` varchar(50) NOT NULL,
  `password` varchar(30) NOT NULL,
  `role` int(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`username`, `password`, `role`) VALUES
('1RV15CS013', 'password1', 1),
('admin', 'admin', 0),
('csespc001', 'csespc001', 3),
('rvceplacement', 'rvceplacement', 4);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `company`
--
ALTER TABLE `company`
  ADD PRIMARY KEY (`CompanyID`);

--
-- Indexes for table `department`
--
ALTER TABLE `department`
  ADD PRIMARY KEY (`DepartmentID`),
  ADD UNIQUE KEY `HOD` (`HOD`);

--
-- Indexes for table `eligibledepartments`
--
ALTER TABLE `eligibledepartments`
  ADD PRIMARY KEY (`DepartmentID`,`TestID`),
  ADD KEY `FKEligibleDe982964` (`TestID`),
  ADD KEY `FKEligibleDe296047` (`DepartmentID`);

--
-- Indexes for table `employee`
--
ALTER TABLE `employee`
  ADD PRIMARY KEY (`EmployeeID`),
  ADD UNIQUE KEY `EmailID` (`EmailID`),
  ADD UNIQUE KEY `MobileNumber` (`MobileNumber`),
  ADD KEY `works for` (`CompanyID`);

--
-- Indexes for table `faculty`
--
ALTER TABLE `faculty`
  ADD PRIMARY KEY (`FacultyID`),
  ADD UNIQUE KEY `EmailID` (`EmailID`),
  ADD UNIQUE KEY `MobileNumber` (`MobileNumber`),
  ADD KEY `Head of Department` (`FacultyID`),
  ADD KEY `managed by` (`DepartmentID`);

--
-- Indexes for table `offer`
--
ALTER TABLE `offer`
  ADD PRIMARY KEY (`USN`,`TestID`),
  ADD KEY `FKOffer62939` (`TestID`),
  ADD KEY `FKOffer226003` (`USN`);

--
-- Indexes for table `register`
--
ALTER TABLE `register`
  ADD PRIMARY KEY (`USN`,`TestID`),
  ADD KEY `FKRegister395044` (`TestID`),
  ADD KEY `FKRegister893897` (`USN`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indexes for table `spc`
--
ALTER TABLE `spc`
  ADD PRIMARY KEY (`USN`,`DepartmentID`),
  ADD KEY `FKSPC733982` (`DepartmentID`),
  ADD KEY `FKSPC241877` (`USN`),
  ADD KEY `username` (`username`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`USN`),
  ADD UNIQUE KEY `MobileNumber` (`MobileNumber`),
  ADD UNIQUE KEY `EmailID` (`EmailID`),
  ADD KEY `DepartmentID` (`Department`);

--
-- Indexes for table `test`
--
ALTER TABLE `test`
  ADD PRIMARY KEY (`TestID`),
  ADD KEY `FKTest927983` (`CompanyID`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `company`
--
ALTER TABLE `company`
  MODIFY `CompanyID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
--
-- AUTO_INCREMENT for table `department`
--
ALTER TABLE `department`
  MODIFY `DepartmentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
--
-- AUTO_INCREMENT for table `employee`
--
ALTER TABLE `employee`
  MODIFY `EmployeeID` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `test`
--
ALTER TABLE `test`
  MODIFY `TestID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `department`
--
ALTER TABLE `department`
  ADD CONSTRAINT `HOD Faculty` FOREIGN KEY (`HOD`) REFERENCES `faculty` (`FacultyID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `eligibledepartments`
--
ALTER TABLE `eligibledepartments`
  ADD CONSTRAINT `FKEligibleDe296047` FOREIGN KEY (`DepartmentID`) REFERENCES `department` (`DepartmentID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FKEligibleDe982964` FOREIGN KEY (`TestID`) REFERENCES `test` (`TestID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `employee`
--
ALTER TABLE `employee`
  ADD CONSTRAINT `works for` FOREIGN KEY (`CompanyID`) REFERENCES `company` (`CompanyID`);

--
-- Constraints for table `faculty`
--
ALTER TABLE `faculty`
  ADD CONSTRAINT `belongs to` FOREIGN KEY (`DepartmentID`) REFERENCES `department` (`DepartmentID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `offer`
--
ALTER TABLE `offer`
  ADD CONSTRAINT `FKOffer226003` FOREIGN KEY (`USN`) REFERENCES `student` (`USN`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FKOffer62939` FOREIGN KEY (`TestID`) REFERENCES `test` (`TestID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `register`
--
ALTER TABLE `register`
  ADD CONSTRAINT `FKRegister395044` FOREIGN KEY (`TestID`) REFERENCES `test` (`TestID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FKRegister893897` FOREIGN KEY (`USN`) REFERENCES `student` (`USN`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `spc`
--
ALTER TABLE `spc`
  ADD CONSTRAINT `FKSPC241877` FOREIGN KEY (`USN`) REFERENCES `student` (`USN`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FKSPC733982` FOREIGN KEY (`DepartmentID`) REFERENCES `department` (`DepartmentID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `usernamekey` FOREIGN KEY (`username`) REFERENCES `user` (`username`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `student`
--
ALTER TABLE `student`
  ADD CONSTRAINT `Dept` FOREIGN KEY (`Department`) REFERENCES `department` (`DepartmentID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `test`
--
ALTER TABLE `test`
  ADD CONSTRAINT `FKTest927983` FOREIGN KEY (`CompanyID`) REFERENCES `company` (`CompanyID`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
