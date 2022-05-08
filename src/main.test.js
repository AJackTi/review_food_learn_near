beforeAll(async function () {
    // NOTE: nearlib and nearConfig are made available by near-cli/test_environment
    const near = await nearlib.connect(nearConfig)
    window.accountId = nearConfig.contractName
    window.contract = await near.loadContract(nearConfig.contractName, {
        viewMethods: ['getGreeting', 'getReview', 'getReviews'], changeMethods: [], sender: window.accountId
    })
})

test('getGreeting', async () => {
    const message = await window.contract.getGreeting({accountId: window.accountId})
    expect(message).toEqual('Hello')
})

test('getReview', async () => {
    const message = await window.contract.getReview({accountId: window.accountId, food: "hotdog"})
    expect(message).toEqual('Good')
})

test('getReviews', async () => {
    const messages = await window.contract.getReview({food: "hotdog"})
    expect(message.length).toEqual(1)
})