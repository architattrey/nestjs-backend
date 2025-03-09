## File Folder Strucrure
nestjs-backend/
│── src/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   ├── auth.guard.ts
│   │   ├── dto/
│   │   │   ├── login.dto.ts
│   │   │   ├── register.dto.ts
│   │   ├── entities/
│   │   │   ├── auth.entity.ts
│   ├── users/
│   │   ├── users.controller.ts
│   │   ├── users.module.ts
│   │   ├── users.service.ts
│   │   ├── dto/
│   │   │   ├── create-user.dto.ts
│   │   │   ├── update-user.dto.ts
│   │   ├── entities/
│   │   │   ├── user.entity.ts
│   ├── roles/
│   │   ├── roles.controller.ts
│   │   ├── roles.module.ts
│   │   ├── roles.service.ts
│   │   ├── entities/
│   │   │   ├── role.entity.ts
│   ├── user-roles/
│   │   ├── user-roles.entity.ts
│   ├── documents/
│   │   ├── documents.controller.ts
│   │   ├── documents.module.ts
│   │   ├── documents.service.ts
│   │   ├── dto/
│   │   │   ├── create-document.dto.ts
│   │   │   ├── update-document.dto.ts
│   │   ├── entities/
│   │   │   ├── document.entity.ts
│   ├── uploads/
│   ├── app.module.ts
│   ├── main.ts
│── config/
│   ├── database.config.ts
│── .env
│── package.json
│── tsconfig.json
│── README.md
  
## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

 

## Support

N 
