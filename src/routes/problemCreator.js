const express = require('express')
const problemRouter = express.Router()


//create problem
problemRouter.post('/create', problemCreate)
problemRouter.delete('/:id', problemDelete)
problemRouter.patch('/:id', problemUpdate)

//above three onnly adminn can do



problemRouter.get('/:id', problemFetch)
problemRouter.get('/', getAllProblems) 
problemRouter.get("/user", solvedProblem)