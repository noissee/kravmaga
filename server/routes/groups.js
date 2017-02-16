/**
 * Groups routes.
 *
 * Routes for handling CRUD operations on groups.
 */

const express = require('express');
const expressJwt = require('express-jwt');

const middleware = require('../middleware/index');
const controller = require('../controllers/groups');

const router = express.Router();
const requireAuth = expressJwt({
    secret: process.env.JWT_SECRET
});

const {
    addIsAdmin, requireIsAdmin,
    canAccessSelfUnlessAdmin
} = middleware;
const {
    getAll, createOne, getOne,
    updateOne, deleteOne, getUserGroups,
    addMember, removeMember,
} = controller;

/**
 * Add middleware that confirms that the user is authenticated and is an admin.
 */
router.all('*', requireAuth, addIsAdmin);

/**
 * Get (all entries) and post (create) route handlers.
 * Both require that the user is an admin.
 */
router.route('/', requireIsAdmin)
    .get(getAll)
    .post(createOne);

/**
 * Get (view), patch (update), and delete route handlers for the entry with the specified ID.
 */
router.route('/:id', requireIsAdmin)
     .get(getOne)
     .patch(updateOne)
     .delete(deleteOne);

//=================
// Custom routes
//=================

/**
 * Routes for retrieving groups for a specific user.
 *
 * Non-admin users can only see lessons for themselves
 */
router.route('/userGroups/:id')
    .get(canAccessSelfUnlessAdmin, getUserGroups);

/**
 * Routes for adding/removing to/from a group.
 */
router.route('/:id/addMember/:memberId')
    .patch(addMember);
router.route('/:id/removeMember/:memberId')
    .patch(removeMember);

module.exports = router;
