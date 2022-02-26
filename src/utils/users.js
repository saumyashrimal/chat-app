const users = [];

// add User

const addUser = ({id,username,room}) => {
    //clean the data 
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();


    //validate the data
    if(!username || !room) {
        return{
            error: 'Username and room are required!'
        }
    }
    
    //check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    });

    //validate username
    if(existingUser){
        return {
            error: 'Useranme is in use!'
        }
    }

    // Store User
    const user = {id, username , room}
    users.push(user)
    return {user}
}

addUser({
    id: 21,
    username:"sam",
    room: "udaipur"
})


console.log(users);




// remove user
const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)
    if(index !== -1){
        return users.splice(index,1);
    }
}


//get user
const getUser = (id) => {
    return users.find((user) => user.id === id)
}
//getUsersInRoom

const getUsersInRoom = (roomName) => {
    return users.filter((user) => user.room === roomName);
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}

