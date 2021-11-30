import { io } from '.';

interface IUserRoom {
  socket_id: string;
  userName: string;
  room: number;
}

interface IMessages {
  userName: string;
  room: number;
  message: string;
  createdAt: Date;
  read: boolean;
  delivered: boolean;
}
interface IMessagesDTO {
  userName: string;
  room: number;
  message: string;
}

interface IChatDTO {
  userName: string;
  room: number;
}

const usersInRoom: IUserRoom[] = [];
const messages: IMessages[] = [];

io.on('connection', socket => {
  console.log('websocket connection', socket.id);
  // Entrar no chat
  socket.on('join_chat', ({ userName, room }: IChatDTO) => {
    socket.join(String(room));

    // Verificar se o user já está na sala
    const userInRoom = usersInRoom.find(
      user => user.userName === userName && user.room === room,
    );

    if (userInRoom) {
      userInRoom.socket_id = socket.id;
    } else {
      usersInRoom.push({
        socket_id: socket.id,
        userName,
        room,
      });

      io.to(String(room)).emit('user_joined', userName);
    }

    console.log('usersInRoom join_chat', usersInRoom);
  });

  // Sair do chat
  socket.on('leave_chat', ({ userName, room }: IChatDTO) => {
    const indexOfUserInRoom = usersInRoom.findIndex(
      roomSocket =>
        roomSocket.userName === userName && roomSocket.room === room,
    );

    if (indexOfUserInRoom !== -1) {
      usersInRoom.splice(indexOfUserInRoom, 1);
    } else {
      console.log('Usuário não encontrado!!!');
    }

    console.log('usersInRoom user Exit', usersInRoom);
  });

  // chat
  socket.on('message', ({ room, message, userName }: IMessagesDTO) => {
    // salvar a mensagem
    const messageReceived: IMessages = {
      room,
      userName,
      message,
      createdAt: new Date(),
      read: false,
      delivered: false,
    };

    messages.push(messageReceived);

    // enviar para os usuário da sala
    io.to(String(room)).emit('message', messageReceived);
  });
});
