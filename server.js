//**************************************** DEPENDENCIES ****************************************//
const express = require('express')
const plaid = require('plaid')
const dotenv = require('dotenv')
const path = require('path')
const jwt = require('jsonwebtoken')
global.bcrypt = require('bcrypt')
global.SALT_ROUNDS = 10
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const models = require('./models')
const PORT = 3301

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))

//allows for talking to .env files
dotenv.config()

/*
app.get('bank-accounts', (req, res) => {
    const headers = req.headers['authorization']  // will return Bearer token
    const token = headers.split('')[1]

    jwt.verify(token, 'secretkey', (error, decoded) => {
        if(error) {
            res.json({success: false, message: 'Unable to verify'})
        }
        else if (decoded) {
            res.json([{name: 'Wells Fargo', amount: 1000000}])
        }
    })

    res.send('BANK_ACCOUNTS')
})
*/

app.post('/login', async (req, res) => {
    const email = req.body.email
    const password = req.body.password

    let permUser = await models.Users.findOne({
        where:{
            email: email,
        }
    }).then(function(permUser) {
        if (!permUser) {
                console.log("nope")
            }
        else {
            bcrypt.compare(password, permUser.password, function(err, result) {
                if (result == true) {
                    console.log(permUser.password)
                    const token = jwt.sign({email: permUser.email}, process.env.SECRET_KEY)
                    res.json({token: token})
                }
                else {
                    console.log("incorrect")
                }
            })
        }
    })
})


//catch function for async
function handleError(errorMessage) {
    console.error(errorMessage)
}

// creating a new Plaid account
const client = new plaid.Client(
    process.env.PLAID_CLIENT_ID, 
    process.env.PLAID_SECRET, 
    process.env.PLAID_PUBLIC_KEY, 
    plaid.environments.sandbox)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false}))
app.use(cors())

//**************************************** PLAID ****************************************//
//logging into plaid sandbox...
//username = user_good
//password = pass_good

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'plaid-link.html'))
})

app.post('/plaid_token_exchange', async (req, res) => {
    
    const { publicToken } = req.body
    const { access_token } = await client.exchangePublicToken(publicToken).catch(handleError)
    const { accounts, item } = await client.getAccounts(access_token).catch(handleError)

    console.log({accounts, item})

})

//**************************************** PLAID DATA TO DATABASE ****************************************//
/*
const item = new Plaid_Item({
    available_products: item.available_products,
    billed_products: item.billed_products,
    institution_id: item.institution_id,
    item_id: item.item_id,
    webhook: item.webhook
})
*/


//**************************************** REGISTER FUNCTIONS ****************************************//
app.post('/add-user', async (req, res) => {
    let first = req.body.first,
    last = req.body.last,
    email = req.body.email,
    phone_number = req.body.phone_number,
    password = req.body.password,
    display_name = req.body.display_name,
    profile_picture_url = req.body.profile_picture_url

    let persistedUser = await models.Users.findOne({
        where:{
            first:first,
            last:last,
            email:email,
            phone_number:phone_number
        }
    })

    // registers user if they don't exist
    if (persistedUser === null){
        bcrypt.hash(password, SALT_ROUNDS, async(error, hash) => {
            if (error) {
                console.log(error)
                res.send('Error creating user ¯\_(ツ)_/¯')
            }
            else {
                    let user = models.Users.build({
                        first: first,
                        last: last,
                        email: email,
                        phone_number: phone_number,
                        password: hash,
                        display_name: display_name,
                        profile_picture_url: profile_picture_url
                    })
                let savedUser = await user.save()
                
                await console.log(savedUser)
                if (savedUser !== null) {
                    res.redirect('/login')
                }
                else {
                    res.send('There is already a user who has registered with that information ¯\_(ツ)_/¯')
                }
            }
        })
    } 
    else {
        res.send('There is already a user who has registered with that information ¯\_(ツ)_/¯')
    }
})

app.get('/view-users', (req, res) => {
    models.Users.findAll().then((users) => {
        res.json({RegisteredUsers:users})
    })
})

app.post('/delete-user/:id', (req, res) => {
    models.Users.destroy({
        where: {
            id: req.params.id
        }
    })
})



//**************************************** ADDRESS FUNCTIONS ****************************************//



//**************************************** INCOMES FUNCTIONS ****************************************//
app.post('/add-income-source', (req, res) => {
    let name = req.body.name,
    type = req.body.type,
    frequency = req.body.frequency,
    amount = req.body.amount,
    next_payment_date = req.body.next_payment_date,
    user_id = req.body.user_id

    const income_source = models.Income_Sources.build({
        name: name,
        type: type,
        frequency: frequency,
        amount: amount,
        next_payment_date: next_payment_date,
        user_id: user_id
    })

    income_source.save().then(savedIncomeSource => res.redirect('/'))
})

app.get('/view-income-sources', (req, res) => {
    models.Income_Sources.findAll().then((income_sources) => {
        res.json({income_sources:income_sources})
    })
})

//**************************************** EXPENSES FUNCTIONS ****************************************//
app.post('/add-expense', (req, res) => {
    let expense_name = req.body.expense_name,
    type = req.body.type,
    frequency = req.body.frequency,
    amount = req.body.amount,
    next_payment_date = req.body.next_payment_date,
    user_id = req.body.user_id

    const expense = models.Expenses.build({
        expense_name: expense_name,
        type: type,
        frequency: frequency,
        amount: amount,
        next_payment_date: next_payment_date,
        user_id: user_id
    })

    expense.save().then(savedExpense => res.redirect('/'))
})

app.get('/view-expenses', (req, res) => {
    models.Expenses.findAll().then((expenses) => {
        res.json({expenses:expenses})
    })
})

//**************************************** SAVINGS-GOALS FUNCTIONS ****************************************//
app.post('/add-savings-goal', (req, res) => {
    let name = req.body.name,
    type = req.body.type,
    user_id = req.body.user_id,
    deadline_date = req.body.deadline_date,
    amount = req.body.amount

    const savingsGoal = models.Savings_Goals.build({
        name: name,
        type: type,
        user_id: user_id,
        deadline_date: deadline_date,
        amount: amount
    })

    savingsGoal.save().then(savedSavingsGoal => res.redirect('/'))
})

app.get('/view-savings-goals', (req, res) => {
    models.Savings_Goals.findAll().then((savings_goals) => {
        res.json({savings_goals:savings_goals})
    })
})

app.post('/delete-savings-goals/:id', (req, res) => {
    models.Savings_Goals.destroy({
        where: {
            id: req.params.id
        }
    })
})

//**************************************** PORT 3301 ****************************************//
app.listen(PORT, () => {
    console.log("Server started at Cicada " + PORT)
})


