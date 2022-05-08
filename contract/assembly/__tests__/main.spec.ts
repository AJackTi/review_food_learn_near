import {setGreeting, setReview} from '..'
import {storage, Context} from 'near-sdk-as'

describe('Greeting ', () => {
    it('should be set and read', () => {
        setGreeting('hello world')
        storage.get<string>(Context.sender)
    })
})

describe('Food ', () => {
    it('should be set and read', () => {
        setReview('Good', 'hotdog')
        storage.get<string>(Context.sender)
    })
})
