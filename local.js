'use strict';
require('dotenv').config()
const app = require('./express/app')

const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log('Local app listening on port:', PORT))