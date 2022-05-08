/*
 * This is an example of an AssemblyScript smart contract with two simple,
 * symmetric functions:
 *
 * 1. setGreeting: accepts a greeting, such as "howdy", and records it for the
 *    user (account_id) who sent the request
 * 2. getGreeting: accepts an account_id and returns the greeting saved for it,
 *    defaulting to "Hello"
 *
 * Learn more about writing NEAR smart contracts with AssemblyScript:
 * https://docs.near.org/docs/develop/contracts/as/intro
 *
 */

import {Context, logging, storage, PersistentMap} from 'near-sdk-as'

import {Food, Account, Review} from "./models";

const DEFAULT_MESSAGE = 'Hello'
let mapAccountFoods = new PersistentMap<string, Array<string>>("m") // account: []foods
let mapFoodAccounts = new PersistentMap<string, Array<string>>("m") // food: []accounts
let mapFoodReviews = new PersistentMap<string, Array<string>>("m") // food: []reviews
let mapFoodAccountReview = new PersistentMap<string, PersistentMap<string, string>>("m") // food: (account:review)

// Exported functions will be part of the public interface for your smart contract.
// Feel free to extract behavior to non-exported functions!
export function getGreeting(accountId: string): string | null {
    // This uses raw `storage.get`, a low-level way to interact with on-chain
    // storage for simple contracts.
    // If you have something more complex, check out persistent collections:
    // https://docs.near.org/docs/concepts/data-storage#assemblyscript-collection-types
    return storage.get<string>(accountId, DEFAULT_MESSAGE)
}

export function setGreeting(message: string): void {
    const accountId = Context.sender
    // Use logging.log to record logs permanently to the blockchain!
    logging.log(`Saving greeting "${message}" for account "${accountId}"`)
    storage.set(accountId, message)
}

export function setReview(message: string, food: string): void {
    const accountId = Context.sender

    if (mapFoodAccounts != null) {
        let accountsExist = mapFoodAccounts.get(food)
        if (accountsExist != null && accountsExist.length > 0) {
            for (let i = 0; i < accountsExist.length; i++) {
                if (accountsExist[i] == accountId) {
                    logging.log(`The account "${accountId}" has reviewed ${food}"`)
                    return
                }
            }
        }
    }

    logging.log(`Saving review food "${message}" for ${food} from account "${accountId}"`)

    // set this review to food
    let someFoods = mapAccountFoods.get(accountId)
    if (someFoods === null) {
        someFoods = new Array<string>()
    }
    someFoods.push(food)
    mapAccountFoods.set(accountId, someFoods)


    let someAccounts = mapFoodAccounts.get(food)
    if (someAccounts === null) {
        someAccounts = new Array<string>()
    }
    someAccounts.push(accountId)
    mapFoodAccounts.set(food, someAccounts)

    let someReviews = mapFoodReviews.get(food)
    if (someReviews === null) {
        someReviews = new Array<string>()
    }
    someReviews.push(message)
    mapFoodReviews.set(food, someReviews)

    if (mapFoodAccountReview === null) {
        mapFoodAccountReview = new PersistentMap<string, PersistentMap<string, string>>("m")
        let account = new PersistentMap<string, string>("m")

        account.set(accountId, message)
        mapFoodAccountReview.set(food, account)
    } else {
        let account = new PersistentMap<string, string>("m")

        account.set(accountId, message)
        mapFoodAccountReview.set(food, account)
    }
}

export function getReview(accountId: string, food: string): string | null {
    if (mapFoodAccountReview != null && mapFoodAccountReview.get(food) != null) {
        let review = mapFoodAccountReview.get(food)!.get(accountId)
        return review
    }
    return null
}

export function getReviews(food: string): Array<string> | null {
    return mapFoodReviews.get(food)
}