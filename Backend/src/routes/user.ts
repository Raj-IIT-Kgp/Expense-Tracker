import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'
import { signupInput, signinInput } from "@raj9339/common-app";

export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    }
}>();

// Example handling of individual input errors
userRouter.post('/signup', async (c) => {
    const body = await c.req.json();
    const { success } = signupInput.safeParse(body);
    if (!success) {
        c.status(411);
        return c.json({
            message: "Invalid input"
        });
    }

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        // Check if a user with the provided username already exists
        const existingUser = await prisma.user.findUnique({
            where: {
                username: body.username,
            }
        });

        if (existingUser) {
            c.status(400);
            return c.json({
                message: "Username already exists"
            });
        }

        const user = await prisma.user.create({
            data: {
                username: body.username,
                password: body.password,
                name: body.name
            }
        });
        const jwt = await sign({
            id: user.id
        }, c.env.JWT_SECRET);
        return c.json({
            token: jwt,
            message: "Signup successfully"
        });
    } catch (e) {
        console.error(e);
        c.status(500);
        return c.json({
            message: "Server error"
        });
    } finally {
        await prisma.$disconnect();
    }
});


userRouter.post('/signin', async (c) => {
    const body = await c.req.json();
    const { success } = signinInput.safeParse(body);
    if (!success) {
        c.status(411);
        return c.json({
            message: "Invalid input"
        })
    }

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    try {
        const user = await prisma.user.findFirst({
            where: {
                username: body.username,
                password: body.password,
            }
        })
        if (!user) {
            c.status(401);
            return c.json({
                message: "user not found or password is incorrect"
            })
        }
        const jwt = await sign({
            id: user.id
        }, c.env.JWT_SECRET);

        return c.json({
            token : jwt,
            message : 'Signin successfully'
        })
    } catch(e) {
        console.log(e);
        c.status(500);
        return c.json({
            message : 'Server error'
        })
    }
})

userRouter.get('/user/:id', async(c) =>{
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const user = await prisma.user.findUnique({
        where: {
            id: Number(c.req.param("id")),
        },
    })

   return  c.json(user);

})

userRouter.put("/user/:id", async(c) =>{
    const body = await c.req.json();
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const user = await prisma.user.update({
        where: {
            id: Number(c.req.param("id")),
        },
        data : body,
    })

    return c.json(user)

})

userRouter.delete("/user/:id", async(c) =>{
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const user = await prisma.user.delete({
        where: {
            id: Number(c.req.param("id")),
        },
    })

    userRouter.get("/users", async(c) =>{
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate())

        const users = await prisma.user.findMany()

        return c.json(users);
    })
})