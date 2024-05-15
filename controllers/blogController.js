'use strict';

const controller = {};
const models = require('../models');
const sequelize = require('sequelize');
// const { options } = require('../routes/blogRouter');
// const { query } = require('express');
const Op = sequelize.Op;

controller.init = async (req, res, next) => {
    res.locals.categories = await models.Category.findAll({
        include: [{ model: models.Blog }]
    })
    res.locals.tags = await models.Tag.findAll();
    next();
}

controller.showList = async (req, res) => {
    let categoryId = isNaN(req.query.category) ? 0 : parseInt(req.query.category);
    let tagId = isNaN(req.query.tag) ? 0 : parseInt(req.query.tag);
    let keyword = req.query.keyword;
    let page = isNaN(req.query.page) ? 1 : parseInt(req.query.page);

    let options = {
        attributes: ['id', 'title', 'imagePath', 'summary', 'createdAt'],
        where: {},
        include: [{ model: models.Comment }],
        order: [["createdAt", "DESC"]]
    }

    if (categoryId > 0) {
        options.where.categoryId = categoryId;
    }

    if (tagId > 0) {
        options.include.push({
            model: models.Tag,
            where: { id: tagId }
        });
    }

    if (keyword) {
        options.where.title = {
            [Op.iLike]: `%${keyword}%`
        }
    }

    let limit = 2;
    // số sản phẩm tối đa
    let offset = page ? limit * (page - 1) : 0;

    let blogs = await models.Blog.findAll(options);
    res.locals.blogs = blogs.slice(offset, offset + limit);
    res.locals.pagination = {
        page,
        limit,
        totalRows: blogs.length,
        queryParams: res.query,
    };

    res.render("blog");
}

controller.showDetails = async (req, res) => {
    res.locals.blog = await models.Blog.findOne({
        attributes: ['id', 'title', 'description', 'createdAt'],
        where: {
            id: req.params.id
        },
        include: [
            { model: models.Category },
            { model: models.Tag },
            { model: models.User },
            { model: models.Comment },
        ],
    });
    
    res.render("blog-details");
}

module.exports = controller;