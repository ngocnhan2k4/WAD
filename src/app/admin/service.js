const prisma = require("../../config/database/db.config");

function funcountSearch(user_search) {
    return prisma.User.count({
        where: user_search
            ? {
                  OR: [
                      {
                          username: {
                              contains: user_search,
                              mode: "insensitive", // Không phân biệt chữ hoa, chữ thường
                          },
                      },
                      {
                          fullName: {
                              contains: user_search,
                              mode: "insensitive", // Không phân biệt chữ hoa, chữ thường
                          },
                      },
                  ],
              }
            : undefined, // Nếu `user_search` không có giá trị, bỏ qua `where`
    });
}

const User = {
    getAll: () => prisma.User.findMany(),
    getAllUser: () => prisma.User.findMany(),
    getTenUser: () =>
        prisma.User.findMany({
            take: 10,
        }),
    getCountUser: async () => {
        const count = await prisma.User.count();
        return count;
    },
    countSearch: async (user_search) => {
        return await funcountSearch(user_search);
    },
    sortUser: async (criteria) => {
        const count = await funcountSearch(criteria.user_search);
        if (criteria.page > Math.ceil(count / 10)) {
            criteria.page = Math.ceil(count / 10);
        }
        const validFields = [
            "fullName",
            "username",
            "registration_time",
            "role",
            "state",
        ];
        if (criteria.key === "") {
            return prisma.User.findMany({
                take: 10,
                skip: (criteria.page - 1) * 10,
                where: criteria.user_search
                    ? {
                          OR: [
                              {
                                  username: {
                                      contains: criteria.user_search,
                                      mode: "insensitive", // Không phân biệt chữ hoa, chữ thường
                                  },
                              },
                              {
                                  fullName: {
                                      contains: criteria.user_search,
                                      mode: "insensitive", // Không phân biệt chữ hoa, chữ thường
                                  },
                              },
                          ],
                      }
                    : undefined, // Không áp dụng điều kiện nếu `user_search` rỗng
            });
        }
        if (!validFields.includes(criteria.key)) {
            throw new Error(`Invalid sorting field: ${criteria.key}`); // Sửa "hrow" thành "throw"
        }
        const key = criteria.key;
        const order = criteria.order;
        return prisma.User.findMany({
            take: 10,
            skip: (criteria.page - 1) * 10,
            where: criteria.user_search
                ? {
                      OR: [
                          {
                              username: {
                                  contains: criteria.user_search,
                                  mode: "insensitive", // Không phân biệt chữ hoa, chữ thường
                              },
                          },
                          {
                              fullName: {
                                  contains: criteria.user_search,
                                  mode: "insensitive", // Không phân biệt chữ hoa, chữ thường
                              },
                          },
                      ],
                  }
                : undefined, // Không áp dụng điều kiện nếu không có user_search
            orderBy: {
                [key]: order,
            },
        });
    },
    updateUser: async (id, role, state) => {
        if (role !== "user" && role !== "admin") {
            throw new Error(`Invalid role: ${role}`);
        }
        return prisma.User.update({
            where: {
                id: id,
            },
            data: {
                role: role,
                state: state,
            },
        });
    },
};

module.exports = User;
