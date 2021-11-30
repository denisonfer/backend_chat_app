import { Request, Response, Router } from 'express';

const usersRoutes = Router();

usersRoutes.get('/', (req: Request, res: Response) => {
  console.log('Chegou na rota get users');

  return res.send('ok');
});

export default usersRoutes;
