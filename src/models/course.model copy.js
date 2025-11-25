const pool = require('../database/connection')
const crypto = require('crypto')

// GET ALL COURSE
const getAllCourse = ({ category, language, search, sortBy, order, limit, page }) =>
    new Promise((resolve, reject) => {
        let sql = 'SELECT * FROM courses'
        const values = []
        const conditions = []

        if (category) {
            conditions.push(`category = $${values.length + 1}`)
            values.push(category)
        }

        if (language) {
            conditions.push(`language = $${values.length + 1}`)
            values.push(language)
        }

        if (search) {
            conditions.push(`(title ILIKE $${values.length + 1} OR description ILIKE $${values.length + 2})`)
            values.push(`%${search}%`, `%${search}%`)
        }

        if (conditions.length > 0) {
            sql += " WHERE " + conditions.join(" AND ")
        }

        if (sortBy) {
            const allowedFields = ["title", "price", "category", "language", "created_at"]
            const allowedOrder = ["asc", "desc"]

            const sortField = allowedFields.includes(sortBy) ? sortBy : "title"
            const sortOrder = allowedOrder.includes(order?.toLowerCase()) ? order.toUpperCase() : "ASC"

            sql += ` ORDER BY ${sortField} ${sortOrder}`
        }

        if (limit && page) {
            const limitValue = parseInt(limit)
            const offset = (parseInt(page) - 1) * limitValue

            sql += ` LIMIT $${values.length + 1} OFFSET $${values.length + 2}`
            values.push(limitValue, offset)
        }

        pool.query(sql, values)
            .then(res => resolve(res.rows))
            .catch(err => reject(err))
    })


// CREATE COURSE
const createCourse = (title, category, description, price, language) =>
    new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO courses (course_id, title, category, description, price, language)
            VALUES ($1, $2, $3, $4, $5, $6)
        `
        const values = [crypto.randomUUID(), title, category, description, price, language]

        pool.query(sql, values)
            .then(res => resolve(res))
            .catch(err => reject(err))
    })


// UPDATE COURSE
const updateCourse = (id, title, category, description, price, language) =>
    new Promise((resolve, reject) => {
        const sql = `
            UPDATE courses
            SET title = $1, category = $2, description = $3, price = $4, language = $5
            WHERE course_id = $6
        `
        const values = [title, category, description, price, language, id]

        pool.query(sql, values)
            .then(res => resolve(res))
            .catch(err => reject(err))
    })


// DELETE COURSE
const deleteCourse = (id) =>
    new Promise((resolve, reject) => {
        const sql = `DELETE FROM courses WHERE course_id = $1`
        pool.query(sql, [id])
            .then(res => resolve(res))
            .catch(err => reject(err))
    })


// GET BY ID
const getCourseById = (id) =>
    new Promise((resolve, reject) => {
        const sql = `SELECT * FROM courses WHERE course_id = $1`
        pool.query(sql, [id])
            .then(res => resolve(res.rows[0]))
            .catch(err => reject(err))
    })

module.exports = {
    getAllCourse,
    createCourse,
    updateCourse,
    deleteCourse,
    getCourseById
}
