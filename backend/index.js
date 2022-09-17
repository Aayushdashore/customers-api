const express = require('express')
const dotenv = require('dotenv')
const { addCustomer, saveCustomer, loadCustomers } = require('./utils')

const app = express()
dotenv.config()
app.use(express.urlencoded())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Api is running')
})

//add customer
app.post('/add/customer', (req, res) => {
  const data = addCustomer(req.body)
  res.send(data)
})

//update the customer -- phone no. is a unique key so we use phone number as identifier and update the customer data
app.patch('/add/customer/update/:phone', (req, res) => {
  const updates = Object.keys(req.body)
  console.log(updates)
  const allowedUpdates = ['phone', 'name', 'age', 'gender']
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  )
  console.log(isValidOperation, 'is valid operation')
  if (!isValidOperation) {
    res.status(400).send({ error: 'invalid update!' })
  } else {
    const customers = loadCustomers()
    console.log(customers)

    const customer = customers.find((cust) => cust.phone == req.params.phone)
    console.log(customer, 'required user')
    updates.forEach((update) => {
      customer[update] = req.body[update]
    })

    console.log(customer, 'updated user')
    const remainingCustomer = customers.filter(
      (cust) => cust.phone !== customer.phone
    )
    console.log(remainingCustomer, 'remainingCustomer')
    const updatedCustomer = [...remainingCustomer, customer]
    saveCustomer(updatedCustomer)
    res.send(customer)
  }
})

//list all users
app.get('/customers', (req, res) => {
  const customers = loadCustomers()
  res.send(customers)
})

//applying filter
app.get('/customers/filter', (req, res) => {
  const minAge = req.query.minAge
  const maxAge = req.query.maxAge
  const customers = loadCustomers()
  console.log(customers, 'minAge', minAge, 'maxAge', maxAge)
  const filteredCustomer = customers.filter(
    (cust) => cust.age > minAge && cust.age < maxAge
  )

  res.send(filteredCustomer)
})
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server is up on port ${PORT}`)
})
