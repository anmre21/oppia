// Copyright 2020 The Oppia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Constants for the Oppia about page.
 */

export const AboutPageConstants = {
  // These credits should not be changed directly. If any change is
  // made to structure/formatting, the respective constants
  // CREDITS_START_LINE, CREDITS_END_LINE and CREDITS_INDENT should be
  // updated in update_changelog_and_credits.py file. If the patterns do
  // not match, update_changelog_and_credits_test will fail.
  CREDITS_CONSTANTS: [
    'Aadya Mishra',
    'Aaron Zuspan',
    'Aashish Gaba',
    'Aashish Singh',
    'Aasif Faizal',
    'Aayush Kumar Singh',
    'Abeer Khan',
    'Abhay Garg',
    'Abhay Gupta',
    'Abhay Raghuwanshi',
    'Abhay Raizada',
    'Abhijit Suresh',
    'Abhimanyu Thakre',
    'Abhishek Arya',
    'Abhishek Kumar',
    'Abhishek Uniyal',
    'Abhith Krishna',
    'Abraham Mgowano',
    'Acash Mkj',
    'Adarsh Kumar',
    'Aditya Dubey',
    'Aditya Jain',
    'Aditya Sharma',
    'Adrija Acharyya',
    'Aishwary Saxena',
    'Ajay Sharma',
    'Ajo John',
    'Akash Gupta',
    'Akshath Kaushal',
    'Akshay Anand',
    'Akshay Nandwana',
    'Alex Gower',
    'Alex Lee',
    'Alexandra Wu',
    'Allan Zhou',
    'Alluri Harshit Varma',
    'Aman Singh Jolly',
    'Amanda Rodriguez',
    'Amey Kudari',
    'Amit Deutsch',
    'Amulya Kumar',
    'Ana Francisca Bernardo',
    'Ananth Raghav',
    'Andrew Low',
    'Andrey Mironyuk',
    'Angela Park',
    'Anggoro Dewanto',
    'Anish V Badri',
    'Ankita Saxena',
    'Anmol Mittal',
    'Anmol Shukla',
    'Anshul Hudda',
    'Anshuman Maurya',
    'Anthony Alridge',
    'Anthony Zheng',
    'Anthony Zhu',
    'Anubhav Sinha',
    'Anumeha Agrawal',
    'Anurag Singh',
    'Anurag Thakur',
    'Anurag Vats',
    'Anurag Verma',
    'Apurv Bajaj',
    'Apurv Botle',
    'Archi Aggarwal',
    'Areesha Tariq',
    'Ariel Cohen',
    'Arkadyuti Bandyopadhyay',
    'Arnesh Agrawal',
    'Arpan Banerjee',
    'Arpit Bandejiya',
    'Arun Kumar',
    'Arunabh Ghosh',
    'Aryaman Gupta',
    'Ashish Patwal',
    'Ashish Verma',
    'Ashmeet Singh',
    'Ashutosh Chauhan',
    'Ashutosh Singla',
    'Ashwath V A',
    'Assem Yeskabyl',
    'Aubrey Wells',
    'Aung Hein Oo',
    'Austin Choi',
    'Avijit Gupta',
    'Ayush Jain',
    'Ayush Jha',
    'Ayush Kumar',
    'Ayush Nandi',
    'Baiba Skujevska',
    'Barnabas Makonda',
    'Ben Henning',
    'Ben Targan',
    'Benjamin Beeshma',
    'Bhavuk Jain',
    'Bill Morrisson',
    'BJ Voth',
    'Bolaji Fatade',
    'Boyd Y. Ching',
    'Brenton Briggs',
    'Brian Lin',
    'Brian Rodriguez',
    'Cathleen Huang',
    'Charisse De Torres',
    'Chase Albert',
    'Chen Shenyue',
    'Chin Zhan Xiong',
    'Chirag Baid',
    'Chris Skalnik',
    'Christopher Tao',
    'Cihan Bebek',
    'Connie Chow',
    'Corey Hunter',
    'Céline Deknop',
    'Darin Nguyen',
    'Darsuu',
    'David Cheng',
    'Dawson Eliasen',
    'Debanshu Bhaumik',
    'Deepam Banerjee',
    'Deepank Agarwal',
    'Denis Samokhvalov',
    'Devi Sandeep',
    'Dharmesh Poddar',
    'Diana Chen',
    'Dipto Chakrabarty',
    'Divyadeep Singh',
    'Domenico Vitarella',
    'Dong Wook Brian Chung',
    'Edward Allison',
    'Eesha Arif',
    'Elizabeth Kemp',
    'Emily Glue',
    'Eric L\'Heureux',
    'Eric Lou',
    'Eric Yang',
    'Estelle Lee',
    'Fang You',
    'Farees Hussain',
    'Felicity Zhao',
    'Florin Balint',
    'Frederik Creemers',
    'Fumiya Goto',
    'Gabriel Fuentes',
    'Gagan Suneja',
    'Gangavarapu Praneeth',
    'Gautam Verma',
    'Geet Choudhary',
    'Geo Jolly',
    'Gopi Vaibhav',
    'Grace Guo',
    'Hadyn Fitzgerald',
    'Hamlet Villa',
    'Hamza Chandad',
    'Hanan Mufti',
    'Hardik Katehara',
    'Haresh Khanna',
    'Harsh Khajuria',
    'Harsh Khilawala',
    'Harshvardhan Singh',
    'Hasitha Kaushan',
    'Hema Sundara Rao Ginni',
    'Henriette Hettinga',
    'Henry Phu',
    'Himanshu Aggarwal',
    'Himanshu Dixit',
    'Hitesh Sharma',
    'Hitesh Tomar',
    'Hope Ngerebara',
    'Hossam Mohammed Alsheikh',
    'Huong Le',
    'Ian Luttrell',
    'Ishan Shanware',
    'Ishan Singh',
    'Jackson Wu',
    'Jacob Davis',
    'Jacob Li Peng Cheng',
    'Jacque Li',
    'Jaideep Sharma',
    'Jairo Honorio',
    'Jakub Osika',
    'James James John',
    'James Xu',
    'Jamie Lau',
    'Jansen Yan',
    'Jared Silver',
    'Jasmine Rider',
    'Jasper Deng',
    'Jaswinder Singh',
    'Jay Vivarekar',
    'Jayasanka Madhawa',
    'Jaysinh Shukla',
    'Jeevesh Garg',
    'Jenna Mandel',
    'Jennifer Chen',
    'Jeremy Emerson',
    'Jerry Chen',
    'Jerry Lau',
    'Jessica Li',
    'Jian Fu',
    'Jiazhi Chen',
    'Jim Zhan',
    'Joel Lau',
    'Jogendra Singh',
    'John Glennon',
    'John Karasinski',
    'John Prince Mesape',
    'Jonathan Slaton',
    'Jordan Cockles',
    'Jordan Stapinski',
    'Joseph Fedota',
    'Joshua Cano',
    'Joshua Lan',
    'Joshua Lusk',
    'Joydeep Mukherjee',
    'Juan Saba',
    'Justin Du',
    'Jérôme',
    'K.N. Anantha Nandanan',
    'Kajol Kumari',
    'Karen Rustad',
    'Karishma Vanwari',
    'Kartikey Pandey',
    'Kashif Jamal Soofi',
    'Kate Perkins',
    'Kathryn Patterson',
    'Kayla Hardie',
    'Kefeh Collins',
    'Kenneth Ho',
    'Kerry Wang',
    'Keshav Bathla',
    'Keshav Gupta',
    'Kevin Conner',
    'Kevin Lee',
    'Kevin Thomas',
    'Kevin Zhang',
    'Khushi Gangopadhyay',
    'Kiran Konduru',
    'Kishan Kumar',
    'Koji Ashida',
    'Konstantinos Kagkelidis',
    'Krishita Jain',
    'Krishna Rao',
    'Kristin Anthony',
    'Kumari Shalini',
    'Kunal Garg',
    'Kyriaki Velliniati',
    'Lakshay Angrish',
    'Lara Davies',
    'Laura Kinkead',
    'Leyla Tuon Cao',
    'Linn Hallonqvist',
    'Lontsi Jordan',
    'Lorrany Azevedo',
    'Lucklita Theng',
    'Luis Ulloa',
    'Lunrong Chen',
    'Madhav Sainanee',
    'Madiyar Aitbayev',
    'Mahendra Suthar',
    'Mai Elshiashi',
    'Mamat Rahmat',
    'Manan Rathi',
    'Manas Tungare',
    'Manoj Mohan',
    'Marcel Schmittfull',
    'Mariana Zangrossi',
    'Mark Cabanero',
    'Mark Halpin',
    'Martin Smithurst',
    'Matt Higgins',
    'Maurício Meneghini Fauth',
    'Md Shahbaz Alam',
    'Meet Vyas',
    'Mert Degirmenci',
    'Michael Anuzis',
    'Michael Mossey',
    'Michael Orwin',
    'Michael Wagner',
    'Michael Wu',
    'Michelle R',
    'Milagro Teruel',
    'Min Tan',
    'Mohammad Shahebaz',
    'Mohammad Zaman',
    'Mohit Balwani',
    'Mohit Gupta',
    'Mohit Musaddi',
    'Mohith Khatri',
    'Mortaza Aghazadah',
    'Mozammel Haque',
    'Mridul Setia',
    'Mungo Dewar',
    'Nadin Tamer',
    'Nalin Bhardwaj',
    'Nalin Chhibber',
    'Naman Kalra',
    'Namuli Joyce',
    'Naveen Kumar Shukla',
    'Netaji Kancharapu',
    'Nicolas Skirkey',
    'Nikhil Agarwal',
    'Nikhil Handa',
    'Nikhil Nair',
    'Nikhil Prakash',
    'Nikhil Sangwan',
    'Nils Johansson',
    'Nimalen Sivapalan',
    'Nisarg Chaudhari',
    'Nischaya Sharma',
    'Nishant Mittal',
    'Nisheal John',
    'Nitanshu Lokhande',
    'Nithesh N. Hariharan',
    'Nitish Bansal',
    'Omshi Samal',
    'Oskar Cieslik',
    'Oswell Chan',
    'Owen Parry',
    'Ozan Filiz',
    'Paloma Oliveira',
    'Pankaj Dahiya',
    'Pankaj Prajapati',
    'Parth Bhoiwala',
    'Parul Priyedarshani',
    'Patrycja Praczyk',
    'Pawan Rai',
    'Pawel Borkar',
    'Phil Wagner',
    'Philip Hayes',
    'Phillip Moulton',
    'Piyush Agrawal',
    'Prakash Subedi',
    'Pranav Siddharth S',
    'Pranshu Srivastava',
    'Prasanna Patil',
    'Pratik Katte',
    'Prayush Dawda',
    'Prottoy Chakraborty',
    'Pulkit Aggarwal',
    'Pulkit Gera',
    'Purhan',
    'Purvi Misal',
    'Radesh Kumar',
    'Rafay Ghafoor',
    'Rafał Kaszuba',
    'Rahul Gurung',
    'Rahul Modi',
    'Raine Hoover',
    'Rajan Garg',
    'Rajat Kumar',
    'Rajat Patwa',
    'Rajat Talesra',
    'Rajendra Kadam',
    'Rajitha Warusavitarana',
    'Rakshit Kumar',
    'Ramin Izadpanah',
    'Raymond Tso',
    'Rebekah Houser',
    'Reinaldo Aguiar',
    'Reshu Kumari',
    'Reto Brunner',
    'Ria Arora',
    'Richard Cho',
    'Rijuta Singh',
    'Rishabh Rawat',
    'Rishav Chakraborty',
    'Ritik Kumar',
    'Rizky Riyaldhi',
    'Robert Moreno Carrillo',
    'Rohan Batra',
    'Rohan Gulati',
    'Rohit Katlaa',
    'Ross Strader',
    'Rudra Sadhu',
    'Rémi Gourdon',
    'Sachin Chauhan',
    'Sachin Gopal',
    'Saeed Jassani',
    'Safwan Mansuri',
    'Sagang Wee',
    'Sagar Manohar',
    'Sahil Jhangar',
    'Sajal Asati',
    'Sajen Sarvajith',
    'Sajna Kadalikat',
    'Samara Trilling',
    'Samriddhi Mishra',
    'Sandeep Dubey',
    'Sandeep Patel',
    'Sanjana Konte',
    'Sanjay Saju Jacob',
    'Sankranti Joshi',
    'Santos Hernandez',
    'Sanyam Khurana',
    'Sasa Cocic-Banjanac',
    'Satish Boggarapu',
    'Satmeet Ubhi',
    'Satwik Kansal',
    'Satyam Bhalla',
    'Satyam Yadav',
    'Saurabh Jamadagni',
    'Saurav Pratihar',
    'Savitha K Jayasankar',
    'Scott Brenner',
    'Scott Junner',
    'Scott Roberts',
    'Sean Anthony Riordan',
    'Sean Lip',
    'Sebastian Zangaro',
    'Seth Beckman',
    'Seth Saloni',
    'Shafqat Dulal',
    'Shantanu Bhowmik',
    'Sharif Shaker',
    'Shiqi Wu',
    'Shitong Shou',
    'Shiva Krishna Yadav',
    'Shivam Chaudhary',
    'Shivam Jha',
    'Shivan Trivedi',
    'Shivansh Bajaj',
    'Shivansh Dhiman',
    'Shivansh Rakesh',
    'Shouvik Roy',
    'Shruti Grover',
    'Shruti Satish',
    'Shubha Gupta',
    'Shubha Rajan',
    'Shubham Bansal',
    'Shubham Korde',
    'Shuta Suzuki',
    'Siddhant Khandelwal',
    'Siddhant Srivastav',
    'Siddharth Batra',
    'Siddharth Mehta',
    'Simran Mahindrakar',
    'Sougata Das',
    'Souhit Dey',
    'Soumyajyoti Dey',
    'Soumyo Dey',
    'Sourab Jha',
    'Sourav Badami',
    'Sourav Singh',
    'Sreelaya Vuyyuru',
    'Sreenivasulu Giritheja',
    'Srijan Reddy',
    'Srikanth Kadaba',
    'Srikar Ch',
    'Stefanie Muroya Lei',
    'Stephanie Federwisch',
    'Stephen Chiang',
    'Stephen Hannon',
    'Steve Jiang',
    'Subhash',
    'Subodh Verma',
    'Sudhanva MG',
    'Sudipta Gyan Prakash Pradhan',
    'Sujay Dey',
    'Sumit Paroothi',
    'Surya Siriki',
    'Taiwo Adetona',
    'Tanishq Gupta',
    'Tanmay Mathur',
    'Tarashish Mishra',
    'Taylor Murray',
    'Ted Tong Li',
    'Teddy Marchildon',
    'Tezuesh Varshney',
    'Tham Wan Jun',
    'Theo Lipeles',
    'Tia Jin',
    'Tianqi Wu',
    'Timothy Cyrus',
    'Tonatiuh Garcia',
    'Tony Afula',
    'Tony Jiang',
    'Tracy Homer',
    'Tran Quang Khai',
    'Travis Shafer',
    'Truong Kim',
    'Tuguldur Baigalmaa',
    'Tushar Mohan',
    'Tyler Ishikawa',
    'Ujjwal Gulecha',
    'Umesh Singla',
    'Utkarsh Dixit',
    'Varazdat Manukyan',
    'Varun Tandon',
    'Vasu Tomar',
    'Vibhor Agarwal',
    'Viet Tran Quoc Hoang',
    'Vijay Patel',
    'Viktor Pishuk',
    'Vinayak Vishwanath Gosain',
    'Vinit Dantkale',
    'Vinita Murthi',
    'Viraj Prabhu',
    'Vishal Desai',
    'Vishal Gupta',
    'Vishal Teotia',
    'Vishnu Nithin Reddy',
    'Vuyisile Ndlovu',
    'Y. Budhachandra Singh',
    'Yash Santosh Kandalkar',
    'Zhan Liang',
    'Vishal Joisar',
    'Vishnu M',
    'Vojtěch Jelínek',
    'Vuyisile Ndlovu',
    'Wiktor Idzikowski',
    'Will Li',
    'Wilson Hong',
    'Xinyu Wu',
    'Xuân (Sean) Lương',
    'Yana Malysheva',
    'Yang Lu',
    'Yash Jipkate',
    'Yash Ladha',
    'Yi Yan',
    'Yiming Pan',
    'Yogesh Sharma',
    'Yousef Hamza',
    'Yuan Gu',
    'Yuliang',
    'Zach Puller',
    'Zach Wiebesiek',
    'Zachery Vekovius',
    'Zhu Chu',
    'Zoe Madden-Wood',
  ]
} as const;
