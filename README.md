To-do list system

GroupNo.: 47
Name: KUAI LE
SID: (12611430)

Application link: https://three81project-q69c.onrender.com

********************************************
# Register

Before login, user need to Register first

There are four fields that user should create:

Account		Password		NickName		Email

There's no format limitation for these fields
		
********************************************
# Login
Through the login interface, each user can access the To-do list system by entering their Account and Password.

Each user has Account, Password, NickName and Email;
[
	{
		Account: XXX, Password: YYY,
	}
]

After successful login, userid will be stored in seesion.

********************************************
# Logout
Each user can log out their account by clicking "logout" button(The button is at the upper left corner).

********************************************
# CRUD service
- Create
-	A To-do list document may contain the following attributes with an example: 

	1)	To-do list Content (Remember to wash clothes)
	2)	Time of record (November 20, 2023)

Create operation is post request, and all information is in body of request.
The border size of records is adjustable
There are no restrictions on the format of the recorded content, and you can enter any letters, numbers, and special symbols that you can see on the keyboard

********************************************
# CRUD service
- Read
-  This option is to find the content which match with the To-do list's information.

-   Searching by key-content
	input content of record you want to find (wash)
	key-content is in the body of post request
	clicking on "Search" button, the matched record will be displayed

********************************************
# CRUD service
- Update
-	The user can update the Record information like below.
	
	Remember to wash clothes --> Remember to dry up the clothes

	In example, we updated the content of record.

********************************************
# CRUD service
- Delete
-	The user can delete the Record information through clicking the red "del" button.

********************************************
# Restful
In this project, there are three HTTP request types, post, get and delete.
- Post 
	Post request is used for record.
	Path URL: /record
	Test: curl -X POST -H "Content-Type: application/json" --data '{"Remember to wash the clothes"}'http://localhost:3000/record

- Get
	Get request is used for find.
	Path URL: /index?keyword=wash
	Test: curl -X GET http://localhost:3000/index?keyword=wash

- Delete
	Delete request is used for deletion.
	Just click the "del" button of record that you want to delete.

- Update
	Update request is used for update recording.
	Path URL: /update?_id=655b63a5cd2b04c9af47c782
	Test: curl -X GET http://localhost:3000/update?_id=655b63a5cd2b04c9af47c782

For all restful CRUD services, login should be done at first.


curl -X POST -H "Content-Type: application/json" --data '{"Remember to wash the clothes"}'http://localhost:3000/record

curl -X GET http://localhost:3000/index?keyword=wash

curl -X GET http://localhost:3000/update?_id=655b63a5cd2b04c9af47c782
