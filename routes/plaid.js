const express = require("express");
const plaid = require("plaid");
const router = express.Router();
const dotenv = require("dotenv");

dotenv.config();

// creating a new Plaid account
const client = new plaid.Client(
  process.env.PLAID_CLIENT_ID,
  process.env.PLAID_SECRET,
  process.env.PLAID_PUBLIC_KEY,
  plaid.environments.sandbox
);

//**************************************** PLAID ****************************************//
//logging into plaid sandbox...
//username = user_good
//password = pass_good

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "plaid-link.html"));
});

router.post("/plaid_token_exchange", async (req, res) => {
  const { publicToken } = req.body;
  const { access_token } = await client
    .exchangePublicToken(publicToken)
    .catch(handleError);
  const { accounts, item } = await client
    .getAccounts(access_token)
    .catch(handleError);

  console.log({ accounts, item });
});

//catch function for async
function handleError(errorMessage) {
  console.error(errorMessage);
}

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

module.exports = router;
