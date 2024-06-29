import {Hono} from "hono";
import { verify } from "hono/jwt";
import {PrismaClient} from "@prisma/client/edge";
import {withAccelerate} from "@prisma/extension-accelerate";


export const transactionRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    },
    Variables: {
        userId: string;
    }
}>();



transactionRouter.use("/*", async (c, next) => {
    const authHeader = c.req.header("Authorization") || "";

    try {
        const user = await verify(authHeader, c.env.JWT_SECRET);
        if (user) {
            c.set("userId", user.id as string);
            await next();
        } else {
            c.status(403);
            return c.json({
                message: "You are not logged in"
            });
        }
    } catch (e) {
        c.status(403);
        return c.json({
            message: "You are not logged in"
        });
    }
});


transactionRouter.get('/get', async (c) => {
    interface QueryParams {
        startDate?: string;
        endDate?: string;
        categoryId?: string;
        transactionType?: string;
        searchString?: string;
    }
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const userId = Number(c.get("userId"));
    const { startDate, endDate, categoryId, transactionType, searchString } = c.req.query as QueryParams;

    try {
        let transactions = [];

        if (startDate && endDate) {
            transactions = await prisma.transaction.findMany({
                where: {
                    AND: [
                        { userId: userId },
                        { date: { gte: new Date(startDate) } },
                        { date: { lte: new Date(endDate) } }
                    ]
                },
                include: {
                    category: true
                }
            });
        } else if (categoryId) {
            transactions = await prisma.transaction.findMany({
                where: {
                    AND: [
                        { userId: userId },
                        { categoryId: parseInt(categoryId) }
                    ]
                },
                include: {
                    category: true
                }
            });
        } else if (transactionType) {
            transactions = await prisma.transaction.findMany({
                where: {
                    AND: [
                        { userId: userId },
                        { type: transactionType }
                    ]
                },
                include: {
                    category: true
                }
            });
        } else if (searchString) {
            transactions = await prisma.transaction.findMany({
                where: {
                    AND: [
                        { userId: userId },
                        {
                            OR: [
                                { description: { contains: searchString } },
                                { category: { name: { contains: searchString } } }
                            ]
                        }
                    ]
                },
                include: {
                    category: true
                }
            });
        } else {
            transactions = await prisma.transaction.findMany({
                where: {
                    userId: userId
                },
                include: {
                    category: true
                }
            });
        }

        return c.json({
            transactions : transactions
        });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        c.status(500)
            return c.json({ error: 'Failed to fetch transactions' });
    }
});



transactionRouter.get('/user', async (c) => {
    const userId = c.get("userId");

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const user = await prisma.user.findUnique({
        where: {
            id: Number(userId),
        },
    })

    if (!user) {
        return c.json({
            message: 'User not found'
        });
    }

    return c.json({
        userId: userId,
        userName: user.name
    });
});

transactionRouter.post('/create', async (c) => {
    const body = await c.req.json();


    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    if(body.amount <=0){
        return c.json({
            message : "Enter positive amount"
        })
    }


    let category = await prisma.category.findFirst({
        where: {
            userId : Number(c.get("userId")),
            name: {
                equals: body.categoryName,
                mode: 'insensitive'
            }
        },
    });

    if (!category) {
        category = await prisma.category.create({
            data: {
                name: body.categoryName,
                userId: Number(c.get("userId")),
            },
        });
    }

    const transaction = await prisma.transaction.create({
        data: {
            amount : body.amount,
            description : body.description,
            type : body.type,
            recurring : body.recurring,
            userId: Number(c.get("userId")),
            categoryId: category.id,
        },
    });

    return c.json({
        message : "Transaction successful",
        transaction : transaction
    })
});

transactionRouter.get('/:id', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const transaction = await prisma.transaction.findUnique({
        where: {
            id: Number(c.req.param("id")),
        },
    });

    if(transaction == null){
        return c.json({
            message : "transaction not find"
        })
    }

    const categoryId = transaction.categoryId;
    const category = await prisma.category.findUnique({
        where : {
            id : Number(categoryId)
        }
    })

   return c.json({
       transaction : transaction,
       category : category
   })
});


transactionRouter.put('/:id', async (c) => {
    const body = await c.req.json();
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    if(body.amount <= 0){
        return c.json({
            message : "Enter positive amount"
        })
    }

    let categoryId;
    if (body.categoryName) {
        let category = await prisma.category.findFirst({
            where: {
                name: body.categoryName ,
                userId : Number(c.get("userId"))
            },
        });

        if (!category) {
            category = await prisma.category.create({
                data: {
                    name: body.categoryName,
                    userId: Number(c.get("userId")),
                },
            });

        }
        categoryId = category.id;
    }

    const transaction = await prisma.transaction.update({
        where: {
            userId : Number(c.get("userId")),
            id: Number(c.req.param("id")),
        },
        data: {
            ...(body.amount && { amount: body.amount }),
            ...(categoryId && { categoryId }),
            ...(body.description && { description: body.description }),
            ...(body.type && { type: body.type }),
        },
    });

   return c.json({
       transaction : transaction
   })
});


transactionRouter.delete('/:id', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    // Check if the transaction exists
    const existingTransaction = await prisma.transaction.findUnique({
        where: {
            id: Number(c.req.param("id")),
        },
    });

    if (!existingTransaction) {
        return c.json({
            message : "Transaction does not exist"
        });
    }


    const transaction = await prisma.transaction.delete({
        where: {
            id: Number(c.req.param("id")),
        },
    });

    return c.json({
        message : "Transaction deleted successfully"
    });
});


transactionRouter.get('/summary/:userId', async (c) => {   //facing problem here
    const userId = c.req.param("userId")
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const incomeTransactions = await prisma.transaction.findMany({
        where: {
            userId: Number(userId),
            type: 'income'
        },
    });

    const expenseTransactions = await prisma.transaction.findMany({
        where: {
            userId: Number(userId),
            type: 'expense'
        },
    });

    const income = incomeTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    const expenses = expenseTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    const balance = income - expenses;

    return c.json({
        userId :  userId,
        income : income,
        expenses : expenses,
        balance : balance
    });
});


transactionRouter.get('/chart-data/:userId', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    try {
        const userId = c.req.param('userId')

        if (!(userId)) {
            return c.json({ error: 'Invalid user ID' }, 400);
        }

        const transactionGroups = await prisma.transaction.groupBy({
            by: ['categoryId'],
            _sum: {
                amount: true,
            },
            where: {
                userId : Number(userId),
                type : 'expense'
            },
        });

        const categoryIds = transactionGroups.map(group => group.categoryId);

        const categories = await prisma.category.findMany({
            where: {
                id: { in: categoryIds },
            },
        });

        const result = transactionGroups.map(group => ({
            ...group,
            category: categories.find(category => category.id === group.categoryId),
        }));

        return c.json(result);
    } catch (error) {
        console.error('Error fetching chart data:', error);
        return c.json({ error: 'Internal server error' }, 500);
    }
});

transactionRouter.get('/spending-over-time/:userId', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const userId = c.req.param('userId');

        if (!userId) {
            return c.json({ error: 'Invalid user ID' }, 400);
        }

        const transactions = await prisma.transaction.findMany({
            where: {
                userId: Number(userId),
                type : 'expense'
            },
            orderBy: {
                date: 'asc',
            },
            select: {
                date: true,
                amount: true,
            },
        });

        return c.json(transactions);
    } catch (error) {
        console.error('Error fetching spending over time data:', error);
        return c.json({ error: 'Internal server error' }, 500);
    }
});


transactionRouter.get('/categories/:userId', async (c) => { // same error
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const userId = c.req.param("userId");


    const categories = await prisma.category.findMany({
        where: {
            userId: Number(userId)
        },
        orderBy: {
            name: 'asc',
        },
    });

    return c.json({
        categories : categories
    });
});

transactionRouter.get('/category/:id', async(c) =>{

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const id = c.req.param("id");

    const category = await prisma.category.findUnique({
        where : {
            id : Number(id)
        }
    })

    return c.json({
        category : category
    })

})


transactionRouter.post('/categories', async (c) => {
    const body = await c.req.json();
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const category = await prisma.category.create({
        data: {
            name: body.name,
            userId: Number(c.get("userId")),
        },
    });

    return c.json({
        category: category
    });
});


transactionRouter.put('/categories/:id', async (c) => {
    const body = await c.req.json();
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const category = await prisma.category.update({
        where: {
            id: Number(c.req.param("id")),
        },
        data: {
            name : body.name,
        }
    });

    return c.json({
        category: category
    });
});

transactionRouter.delete('/categories/:id', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const categoryId = Number(c.req.param("id"));

    // Fetch all transactions associated with this category
    const transactionsToUpdate = await prisma.transaction.findMany({
        where: {
            categoryId: categoryId,
        },
    });

    let othersCategory = await prisma.category.findFirst({
        where: {
            name: 'others',
            userId : Number(c.get("userId"))
             },
    });

    if (!othersCategory) {
        othersCategory = await prisma.category.create({
            data: {
                name: 'others',
                userId: Number(c.get("userId")),
            },
        });
    }


    for (const transaction of transactionsToUpdate) {
        await prisma.transaction.update({
            where: { id: transaction.id },
            data: { categoryId: othersCategory.id },
        });
    }


    const category = await prisma.category.delete({
        where: {
            id: categoryId,
        },
    });

    return c.json({
        message : "Category deleted successfully"
    });
});

transactionRouter.put('/:id/recurring', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const transaction = await prisma.transaction.update({
        where: {
            id: Number(c.req.param("id")),
        },
        data: {
            recurring: true,
        },
    });

    return c.json({
        transaction: transaction
    });
});




















