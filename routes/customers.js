
const {CustomerModel,validateSentCustomer} = require('../models/customer'); 
const mongoose = require('mongoose');
const express = require('express');
const customerRoute = express.Router();

customerRoute.get('/', async (req, res) => {
  const customers = await Customer.find().sort('name');
  res.send(customers);
});

customerRoute.post('/create/', async (req, res) => {
  const { error } = validateSentCustomer(req.body);  //TEST THIS
  if (error) return res.status(400).send(error.details[0].message);

  let customer = new CustomerModel({ 
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone
  });
  customer = await customer.save();
  
  res.send(customer);
});

customerRoute.put('/findAndUpdate/:id', async (req, res) => {
  const { error } = validateSentCustomer(req.body);   //TEST THIS
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await CustomerModel.findByIdAndUpdate(req.params.id,
    { 
      name: req.body.name,
      isGold: req.body.isGold,
      phone: req.body.phone
    }, { new: true });

  if (!customer) return res.status(404).send('The customer with the given ID was not found.');
  
  res.send(customer);
});

customerRoute.delete('/delete/:id', async (req, res) => {
  const customer = await CustomerModel.findByIdAndRemove(req.params.id);

  if (!customer) return res.status(404).send('The customer with the given ID was not found.');

  res.send(customer);
});

customerRoute.get('/customer/:id', async (req, res) => {
  const customer = await CustomerModel.findById(req.params.id);

  if (!customer) return res.status(404).send('The customer with the given ID was not found.');

  res.send(customer);
});

module.exports = customerRoute; 
