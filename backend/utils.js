const fs = require('fs')

const addCustomer = (body) => {
  const customers = loadCustomers()
  const duplicateCustomers = customers.filter(
    (customer) => customer.phone === body.phone
  )
  if (duplicateCustomers.length === 0) {
    customers.push(body)
    saveCustomer(customers)
    return customers
  } else {
    return { error: 'customer already exist' }
  }
}

const saveCustomer = (customers) => {
  const dataJSON = JSON.stringify(customers)
  fs.writeFileSync('./frontend/customer.json', dataJSON)
}

const loadCustomers = () => {
  try {
    const dataBuffer = fs.readFileSync('./frontend/customer.json')
    const dataJSON = dataBuffer.toString()
    return JSON.parse(dataJSON)
  } catch (e) {
    return []
  }
}

module.exports = {
  addCustomer: addCustomer,
  saveCustomer: saveCustomer,
  loadCustomers: loadCustomers,
}
