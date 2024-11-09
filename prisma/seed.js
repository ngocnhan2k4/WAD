const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


async function main(){
    await prisma.user.createMany({
        data:[
            {username:'nhansensei',password:'secret'},
            {username:'nhansensei1',password:'secret'},
        ]
    })
    //other table
}


main()
    .catch((e) =>{
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });   