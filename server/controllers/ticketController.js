const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Ticket = require('../models/ticketModel');

/*
@desc Get a users tickets
@route /api/tickets
@access Private
*/
const getTickets = asyncHandler(async (req, res) =>
{

    // Hold the user
    const user = await User.findById(req.user.id);

    // Check if the user exists
    if(!user)
    {
        res.status(401);
        throw new Error('User not found');
    }

    // Retrieve tickets from MongoDB
    const tickets = await Ticket.find({user: req.user.id});

    // Return the tickets 
    res.status(200).json(tickets);
})

/*
@desc Get a all the tickets 
@route /api/tickets/tutor-view
@access Public
*/
const getAllTickets = asyncHandler(async(req, res) =>
{

    // Fetch the tickets 
    try
    {
        const tickets = await Ticket.find();
        res.status(200).json(tickets);
    }

    // Else throw an Error
    catch(error)
    {
        res.status(401);
        throw new Error('Not a tutor.')
    }
})

/*
@desc Get a single ticket 
@route /api/tickets/:id
@access Private
*/
const getSingleTicket = asyncHandler(async(req, res) =>
{

    // Hold the user
    const user = await User.findById(req.user.id);

    // Check if there is a user
    if(!user)
    {
        res.status(401);
        throw new Error('User not found');
    }

    // Hold and find a ticket
    const ticket = await Ticket.findById(req.params.id);

    // Check if there is a ticket
    if(!ticket)
    {
        res.status(404);
        throw new Error('Ticket not found');
    }

    // Check if the user is allowed to access that ticket
    if(ticket.user.toString() !== req.user.id && !user.isAdmin)
    {
        res.status(401);
        throw new Error('Not authorized');
    }

    // Return the specific ticket
    res.status(200).json(ticket);
})

/*
@desc Create a single ticket
@route /api/tickets/
@access Private
*/
const createTicket = asyncHandler(async (req, res) =>
{

    // Hold the data for the ticket
    const {product, description} = req.body;

    // Check if there is data for the ticket
    if(!product || !description)
    {
        res.status(400);
        throw new Error('Please add a product and description');
    }

    // Hold the user
    const user = await User.findById(req.user.id);

    // Check if there is a user
    if(!user)
    {
        res.status(401);
        throw new Error('User not found');
    }

    // Create a ticket model using the Ticket schema
    const ticket = await Ticket.create(
        {
            product,
            description,
            user: req.user.id,
            status: 'new',
            tutor: null
        }
    )

    // Post the ticket onto MongoDB
    res.status(200).json(ticket)
})

/*
@desc Delete a single ticket
@route /api/tickets/:id
@access Private
*/
const deleteSingleTicket = asyncHandler(async(req, res) =>
{

    // Hold the user
    const user = await User.findById(req.user.id);

    // Check if there is a user
    if(!user)
    {
        res.status(401);
        throw new Error('User not found');
    }

    // Hold the ticket
    const ticket = await Ticket.findById(req.params.id);

    // Check if there is a ticket
    if(!ticket)
    {
        res.status(404);
        throw new Error('Ticket not found');
    }

    // Check if the user is allowed to access that ticket
    if(ticket.user.toString() !== req.user.id && !user.isAdmin)
    {
        res.status(401);
        throw new Error('Not authorized');
    }

    // Remove the ticket from MongoDB
    await ticket.remove();
    
    // Send a success message
    res.status(200).json({success: true});
})

/*
@desc Update a single ticket
@route /api/tickets/:id
@access Private
*/
const updateSingleTicket = asyncHandler(async(req, res) =>
{

    // Hold a user
    const user = await User.findById(req.user.id);

    // Check if there is a user
    if(!user)
    {
        res.status(401);
        throw new Error('User not found');
    }

    // Hold the ticket
    const ticket = await Ticket.findById(req.params.id);

    // Check if there is a ticket
    if(!ticket)
    {
        res.status(404);
        throw new Error('Ticket not found');
    }

    // Check if the user is allowed to access that ticket
    if(ticket.user.toString() !== req.user.id && !user.isAdmin)
    {
        res.status(401);
        throw new Error('Not authorized');
    }

    // Update the ticket on MongoDB
    const updatedTicket = await Ticket.findByIdAndUpdate(req.params.id, req.body, {new: true})
    
    // Put the new ticket in MongoDB
    res.status(200).json(updatedTicket);
})

module.exports = 
{
    createTicket,
    deleteSingleTicket,
    getAllTickets,
    getSingleTicket,
    getTickets,
    updateSingleTicket
}

