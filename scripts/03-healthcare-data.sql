-- Seed Healthcare Database with Sample Data
-- Removed USE statement (PostgreSQL doesn't support it)

-- Insert Doctors
INSERT INTO healthcare.Doctor (Doctor_ID, Doctor_SSN, Name, Phone_Number) VALUES
(101, '1266071613', 'Akshay', 7407535102),
(102, '8083069438', 'Vishal', 5775593029),
(103, '9017595693', 'Hua', 1694362521),
(104, '9190841246', 'John', 7630399848),
(105, '5083126610', 'Kate', 2420072433),
(106, '7881793415', 'Donald', 7478736086),
(107, '9364885804', 'Mathew', 3851072550),
(108, '4931814876', 'Joe', 2291855091),
(109, '6660443937', 'Elizabeth', 8795129630),
(110, '9877557927', 'Arya', 1443429264);

-- Insert Patients
INSERT INTO healthcare.Patient (Patient_ID, Patient_SSN, Doctor_ID, Name, Gender) VALUES
(1001, '8392206319', 109, 'John', 'Male'),
(1002, '8473303738', 108, 'Akash', 'Male'),
(1003, '7453409011', 109, 'Irfan', 'Male'),
(1004, '5904533830', 110, 'Monica', 'Female'),
(1005, '8482778872', 101, 'Charlie', 'Male'),
(1006, '5528263293', 103, 'Angelina', 'Female'),
(1007, '2482671444', 104, 'Tony', 'Male'),
(1008, '1456958542', 107, 'Vikram', 'Male'),
(1009, '5493466731', 110, 'Rachel', 'Female'),
(1010, '7943069430', 101, 'Selena', 'Female'),
(1011, '7825142258', 102, 'Shuting', 'Female'),
(1012, '6546546525', 105, 'Alan', 'Male'),
(1013, '3233698740', 106, 'Zhao', 'Female'),
(1014, '4563636948', 102, 'Siyu', 'Female'),
(1015, '4012894863', 104, 'Nicolas', 'Male'),
(1016, '8521403658', 108, 'Bruno', 'Male'),
(1017, '9865659235', 110, 'Nikki', 'Female');

-- Insert Paycheck (doctor salary data)
INSERT INTO healthcare.Paycheck (Cheque_Number, Doctor_ID, Salary, Bonus, Pay_Date) VALUES
(101, 101, 11934.43, 3188.33, '2020-07-31'),
(102, 102, 7839.88, 4350.22, '2020-08-31'),
(103, 110, 6180.097, 5497.75, '2020-08-31'),
(104, 101, 8013.878, 3129.58, '2020-06-30'),
(105, 103, 6443.145, 6164.45, '2020-05-31'),
(106, 104, 7563.87, 5421.22, '2020-07-31'),
(107, 105, 10216.875, 7544.225, '2020-07-31'),
(108, 107, 7640.142, 5190.252, '2020-06-30'),
(109, 109, 7736.25, 5753.002, '2020-05-31'),
(110, 104, 8831.368, 6749.85, '2020-09-30'),
(111, 106, 7495.05, 2643.035, '2020-07-31'),
(112, 107, 7804.575, 3140.003, '2020-05-31'),
(113, 108, 10421.271, 5305.0301, '2020-06-30'),
(114, 110, 10114.757, 3457.552, '2020-09-30'),
(115, 102, 7204.1, 4814.982, '2020-09-30'),
(116, 104, 9142.002, 5572.45, '2020-08-31'),
(117, 109, 9312.028, 3958.99, '2020-07-31'),
(118, 101, 6244.0585, 3824.565, '2020-08-31');

-- Insert Insurance Companies
INSERT INTO healthcare.Insurance (Company_ID, Company_Name, Phone_Number) VALUES
(100, 'AARP', 2024343525),
(101, 'Aetna', 8008723862),
(102, 'Amerigroup', 8006004441),
(103, 'CareSource', 8004880134),
(104, 'Humana', 8004574708),
(105, 'Cigna', 8009971654),
(106, 'Health Net', 8006756110),
(107, 'Anthem', 8003311476),
(108, 'Centene Corporation', 3147254477),
(109, 'Kemper Corporation', 8668609348),
(110, 'EmblemHealth', 8662740060);

-- Insert Diagnoses
INSERT INTO healthcare.Diagnosis (Diagnosis_ID, Diagnosis_Category, Base_Price) VALUES
(1, 'Nervous System', 4000),
(2, 'Eye', 2000),
(3, 'Respiratory System', 5000),
(4, 'Digestive System', 6000),
(5, 'Kidney and Urinary Tract', 10000),
(6, 'Male Reproductive System', 5000),
(7, 'Female Reproductive System', 5500),
(8, 'Mental Diseases and Disorders', 2150),
(9, 'Burns', 2500),
(10, 'HIV Infection', 15000);

-- Insert Medicines
INSERT INTO healthcare.Medicine (Medicine_Inventory_ID, Medicine_Name, Manufacturer, Quantity, Price) VALUES
(1, 'Accuretic', 'Pfizer', 200, 15.23),
(2, 'Accupril', 'Pfizer', 500, 20.443),
(3, 'Benefix', 'Pfizer', 600, 30.56),
(4, 'Berodual', 'Boehringer Ingelheim', 200, 12.67),
(5, 'Aptivus', 'Boehringer Ingelheim', 500, 58.33),
(6, 'Microzide', 'Allergan', 200, 74.098),
(7, 'Namenda', 'Allergan', 100, 95.905),
(8, 'Skyrizi', 'Abbvie', 200, 20.34),
(9, 'Tricor', 'Abbvie', 500, 15.45),
(10, 'Galvus', 'Novartis', 600, 23.43);

-- Insert CPT Codes
INSERT INTO healthcare.CPT (CPT_ID, CPT_Category, CPT_Price) VALUES
(1, 'DAF', 200),
(2, 'DAT', 1000),
(3, 'DES', 244),
(4, 'DEQ', 500),
(5, 'DEQ', 345),
(6, 'DES', 455),
(7, 'DAT', 1456.55),
(8, 'DDU', 879.098),
(9, 'DDU', 566.54),
(10, 'DAF', 234.433);

-- Insert Prescriptions
INSERT INTO healthcare.Prescription (Prescription_ID, Patient_ID, Prescription_Date) VALUES
(1, 1001, '2020-07-22'),
(2, 1002, '2020-05-15'),
(3, 1003, '2020-06-02'),
(4, 1004, '2020-08-26'),
(5, 1005, '2020-09-09'),
(6, 1006, '2020-07-14'),
(7, 1007, '2020-11-04'),
(8, 1008, '2020-08-31'),
(9, 1009, '2020-10-10'),
(10, 1010, '2020-09-05'),
(11, 1011, '2020-07-22'),
(12, 1012, '2020-06-30'),
(13, 1013, '2020-08-21'),
(14, 1014, '2020-08-08'),
(15, 1015, '2020-09-09'),
(16, 1016, '2020-09-02'),
(17, 1017, '2020-10-22');

-- Insert Prescribe Medicine associations
INSERT INTO healthcare.Prescribe_Medicine (Prescription_ID, Medicine_Inventory_ID, Quantity) VALUES
(1, 3, 30),
(2, 10, 40),
(3, 7, 10),
(4, 4, 30),
(5, 3, 25),
(6, 5, 20),
(7, 2, 35),
(8, 7, 15),
(9, 5, 50),
(10, 5, 65),
(11, 1, 24),
(12, 6, 56),
(13, 7, 67),
(14, 8, 16),
(15, 9, 23),
(16, 4, 56),
(17, 5, 9);

-- Insert Invoices
INSERT INTO healthcare.Invoice (Invoice_Number, Patient_ID, CPT_ID, Diagnosis_ID, Amount, Invoice_Date, Prescription_ID) VALUES
(101, 1001, 1, 6, 10255.87, '2020-08-31', 1),
(102, 1002, 2, 8, 8547.369, '2020-06-22', 2),
(103, 1003, 1, 6, 8633.21, '2020-07-25', 3),
(104, 1004, 4, 9, 5600.55, '2020-09-16', 4),
(105, 1005, 3, 2, 6007.223, '2020-05-24', 5),
(106, 1006, 3, 3, 15005.635, '2020-10-19', 6),
(107, 1007, 2, 5, 27586.782, '2020-11-22', 7),
(108, 1008, 8, 4, 6790.23, '2020-09-05', 8),
(109, 1009, 8, 9, 7008.65, '2020-11-28', 9),
(110, 1010, 2, 2, 7852.33, '2020-11-30', 10),
(111, 1011, 5, 7, 6952.55, '2020-09-23', 11),
(112, 1012, 6, 1, 20545.36, '2020-07-25', 12),
(113, 1013, 7, 10, 23584.96, '2020-08-08', 13),
(114, 1014, 9, 1, 22563.225, '2020-08-31', 14),
(115, 1015, 10, 5, 30054.57, '2020-10-30', 15),
(116, 1016, 7, 8, 7258.45, '2020-09-16', 16),
(117, 1017, 4, 9, 10458.66, '2020-06-26', 17);

-- Insert Payments
INSERT INTO healthcare.Payment (Transaction_Number, Invoice_Number, Payment_Status, Payment_Method, Payment_Date) VALUES
(1001, 101, 'FAILED', 'Card', '2020-09-02'),
(1002, 102, 'PENDING', 'Online Banking', '2020-06-25'),
(1003, 103, 'PENDING', 'Card', '2020-07-25'),
(1004, 107, 'SUCCESS', 'Cash', '2020-11-22'),
(1005, 108, 'SUCCESS', 'Cash', '2020-07-15'),
(1006, 104, 'SUCCESS', 'Card', '2020-09-17'),
(1008, 103, 'FAILED', 'Card', '2020-07-26'),
(1009, 105, 'PENDING', 'Online Banking', '2020-05-26'),
(1010, 110, 'SUCCESS', 'Online Banking', '2020-11-28'),
(1011, 106, 'SUCCESS', 'Card', '2020-10-25'),
(1012, 109, 'FAILED', 'Online Banking', '2020-10-31'),
(1013, 111, 'PENDING', 'Online Banking', '2020-09-13'),
(1014, 112, 'PENDING', 'Card', '2020-08-31'),
(1015, 113, 'FAILED', 'Card', '2020-07-19'),
(1016, 114, 'PENDING', 'Cash', '2020-09-09'),
(1017, 115, 'PENDING', 'Cash', '2020-11-20'),
(1018, 116, 'PENDING', 'Online Banking', '2020-11-04'),
(1019, 117, 'FAILED', 'Card', '2020-06-01'),
(1020, 115, 'FAILED', 'Online Banking', '2020-08-15'),
(1021, 114, 'SUCCESS', 'Cash', '2020-07-22'),
(1022, 109, 'SUCCESS', 'Card', '2020-06-30'),
(1023, 113, 'SUCCESS', 'Cash', '2020-10-22');

-- Insert CoveredBy (Patient-Insurance relationships)
-- Only insert records for patients WITH insurance coverage (non-NULL Company_ID)
INSERT INTO healthcare.CoveredBy (Patient_ID, Company_ID, Insurance_Serial_Number, Insurance_Expiry_Date) VALUES
(1002, 108, 'SNQ657567', '2020-06-12'),
(1004, 101, 'STS474766', '2020-01-01'),
(1005, 100, 'SIS970766', '2020-12-12'),
(1007, 101, 'SMS990766', '2020-12-31'),
(1008, 105, 'SOS940766', '2020-07-25'),
(1009, 105, 'NHI900766', '2020-05-05'),
(1011, 102, 'TLM911766', '2020-12-31'),
(1012, 103, 'VHT980066', '2021-06-30'),
(1013, 104, 'MRT988755', '2021-04-30'),
(1014, 106, 'SPL987866', '2020-11-30'),
(1015, 110, 'RGI000234', '2020-07-31'),
(1016, 102, 'OIU985566', '2020-12-31'),
(1017, 110, 'MOG923766', '2021-07-31');
