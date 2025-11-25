const pool = require("../config/db")

const getAllCourse = ({ category, language, search, sortBy, order, limit, page }) => {
    return new Promise((resolve, reject) => {

        let sql = `
            SELECT 
                c.course_id,
                c.title,
                c.category,
                c.description,
                c.price,
                c.language,
                COALESCE(AVG(f.rating), 0) AS avg_rating,
                COUNT(f.rating) AS total_reviews
            FROM courses c
            LEFT JOIN feedbacks f ON c.course_id = f.id_course
        `;

        const values = [];
        const conditions = [];

        // Filter
        if (category) {
            conditions.push(`c.category = $${values.length + 1}`);
            values.push(category);
        }

        if (language) {
            conditions.push(`c.language = $${values.length + 1}`);
            values.push(language);
        }

        if (search) {
            conditions.push(`(c.title ILIKE $${values.length + 1} OR c.description ILIKE $${values.length + 2})`);
            values.push(`%${search}%`, `%${search}%`);
        }

        if (conditions.length > 0) {
            sql += " WHERE " + conditions.join(" AND ");
        }

        sql += " GROUP BY c.course_id ";

        // Sorting
        if (sortBy) {
            const allowed = {
                "title": "c.title",
                "price": "c.price",
                "category": "c.category",
                "language": "c.language",
                "rating": "avg_rating",
                "reviews": "total_reviews"
            };

            const sortField = allowed[sortBy] || "c.title";
            const sortOrder = order?.toLowerCase() === "desc" ? "DESC" : "ASC";

            sql += ` ORDER BY ${sortField} ${sortOrder}`;
        } else {
            sql += ` ORDER BY c.title ASC`;
        }

        // Pagination
        if (limit && page) {
            const limitValue = parseInt(limit);
            const offset = (parseInt(page) - 1) * limitValue;

            sql += ` LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
            values.push(limitValue, offset);
        }

        pool.query(sql, values)
            .then(res => resolve(res.rows))
            .catch(err => reject(err));
    });
};

module.exports = {
    getAllCourse
};
