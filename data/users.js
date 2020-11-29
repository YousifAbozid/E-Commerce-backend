import bcrypt from 'bcryptjs'

const users = [
    {
        name: 'Yousif Abozid',
        email: 'yousif.abozid@yahoo.com',
        password: bcrypt.hash('Yoyo', 10),
        isAdmin: true
    },
    {
        name: 'Merit Mourad',
        email: 'merit@yahoo.com',
        password: bcrypt.hash('Yoyo', 10)
    },
    {
        name: 'Muhammed Badr',
        email: 'muhammed@yahoo.com',
        password: bcrypt.hash('Yoyo', 10)
    }
]

export default users