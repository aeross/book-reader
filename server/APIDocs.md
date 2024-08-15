# Book Reader API Documentation

---

## General Response Structure:
```json
{
    "statusCode": 200,
    "message": "Success",
    "data": ...
}
```

# Entities
## 1. Book
### - GET /book
*Gets 10 books based on URL params.*

Query params: `sort`, `filter`, `search`, `page`, `limit` (sort and search can't be done at the same time)

Response: `Book[limit]`

### - GET /book/random
*Gets 10 books at random.*

Response: `Book[10]`

### - GET /book/{id}
Response: `Book`

### - POST /book
Request: `Book`

Response: `Book`

### - PUT /book/{id}
Request: `Book`

Response: `Book`

### - DELETE /book/{id}
Request: `Book`

Response: `Book`

### - GET /book/get-authors/{id}
*Gets all users who authored a book with book id = `id`.*

Response: `User[]`


## 2. Chapter
### - GET /chapter/book/{id}
*Gets all chapters in a book with book id = `id`.*

Response: `Chapter[]`

### - GET /chapter/{id}
Response: `Chapter`

### - POST /chapter
Request: `Chapter`

Response: `Chapter`

### - PUT /chapter/{id}
Request: `Chapter`

Response: `Chapter`

### - DELETE /chapter/{id}
Request: `Chapter`

Response: `Chapter`


## 3. Readlist
### - GET /readlist
*Gets all readlists owned by the currently logged-in user.*

Response: `Readlist[]`

### - GET /readlist/{username}
*Gets all readlists owned by the user with username = `username`.*

Response: `Readlist[]`

### - POST /readlist
Request: `Readlist`

Response: `Readlist`

### - POST /readlist/add-book
*Adds book with book id = `bookId` into the readlist with readlist id = `readlistId`.*

Request: 
```json
{
    "readlistId": "number",
    "bookId": "number"
}
```
Response: `Readlist`

### - DELETE /readlist/delete-book
*Adds book with book id = `bookId` into the readlist with readlist id = `readlistId`.*

Request: 
```json
{
    "readlistId": "number",
    "bookId": "number"
}
```
Response: `Readlist`


## 4. User
### - POST /user/login
Request:
```json
{
    "username": "string",
    "password": "string"
}
```
Response: token

### - POST /user/register
Request: `User`

Response: `User`

### - GET /user/{username}/books
*Gets all books authored by user with username = `username`.*

Response: `Book[]`

### - GET /user/{username}/likes
*Gets all books likeed by user with username = `username`.*

Response: `Book[]`

### - POST /user/like
*Like or unlike book, depending on whether user has already liked this book before.*

Request:
```json
{
    "bookId": "number"
}
```
Response: success message

### - GET - /user/{username}
*Gets user data with username = `username`.*

Response: `User`

### - GET - /user
*Gets currently logged-in user data.*

Response: `User`


## 5. File
### - POST /file/book/{id}
*Uploads cover image file as a base64 string for a book with book id = `id`.*

Request: 
```json
{
    "base64": "string"
}
```

Response: success message

### - DELETE /file/book/{id}
*Deletes cover image file for a book with book id = `id`.*

Response: success message

### - POST /file/user/{id}
*Uploads profile picture file as a base64 string for the currently logged-in user.*

Request: 
```json
{
    "base64": "string"
}
```

Response: success message

### - DELETE /file/user/{id}
*Deletes profile picture file for the currently logged-in user.*

Response: success message