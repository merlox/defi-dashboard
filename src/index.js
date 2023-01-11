import { chain, configureChains, createClient } from '@wagmi/core'
import { ClientCtrl, ConfigCtrl } from '@web3modal/core'
import { EthereumClient, modalConnectors, walletConnectProvider } from '@web3modal/ethereum'

const setupWallet = async () => {
    // 1. Define constants
    const projectId = '8e6b5ffdcbc9794bf9f4a1952578365b'
    const chains = [chain.mainnet]

    // 2. Configure wagmi client
    const { provider } = configureChains(chains, [walletConnectProvider({ projectId })])
    const wagmiClient = createClient({
        autoConnect: true,
        connectors: modalConnectors({ appName: 'web3Modal', chains }),
        provider
    })

    // 3. Configure ethereum client
    const ethereumClient = new EthereumClient(wagmiClient, chains)

    // 4. Configure modal and pass ethereum client to it
    ConfigCtrl.setConfig({
        projectId,
        theme: 'dark',
        accentColor: 'default'
    })
    ClientCtrl.setEthereumClient(ethereumClient, chains)

    // Detects when an account is connected, when an account is disconnected
    // and when an account is changed with a different wallet
    ethereumClient.watchAccount(async change => {
        document.querySelector('#wallet').innerHTML = change.address || ''
        if (change.address) {
            document.querySelector('#asset-container').innerHTML = ''
            document.querySelector('#loading-assets').style.display = 'inherit'
            document.querySelector('#connect-message').style.display = 'none'
            document.querySelector('#loading-positions').style.display = 'none'
            await getAssets('0xC36442b4a4522E871399CD717aBDD847Ab11FE88')
            // await getAssets(change.address)
            document.querySelector('#loading-positions').style.display = 'inherit'
            await getPositions('0xC36442b4a4522E871399CD717aBDD847Ab11FE88')
            // await getPositions(change.address)
            document.querySelector('#loading-positions').style.display = 'none'
            document.querySelector('#connect-message').style.display = 'none'
            document.querySelector('#loading-assets').style.display = 'none'
        } else {
            document.querySelector('#connect-message').style.display = 'inherit'
            document.querySelector('#loading-assets').style.display = 'none'
            document.querySelector('#asset-container').innerHTML = ''
            document.querySelector('#loading-positions').style.display = 'none'
        }
    })

    // 5. Import ui package after all configuration has been completed
    await import('@web3modal/ui')
}

const getAssets = async wallet => {
    console.log('getting assets')
    let res = await fetch(`/asset-balances/${wallet}`)
    res = await res.json()
    console.log('assets received')

    let totalUSD = 0

    for (let i = 0; i < res.length; i++) {
        const usd = res[i].asset.usd.toFixed(3) == 0 ? 0 : Number(res[i].asset.usd.toFixed(3))
        totalUSD += res[i].asset.usd
        const chainsArray = res[i].asset.chains.map(item => `
            <li>
                ${item.chain}: ${item.balance} ${res[i].asset.symbol} ($${usd})
            </li>
        `)
        document.querySelector('#asset-container').insertAdjacentHTML('beforeend', `
            <li class="asset">
                <b>${res[i].asset.symbol}</b>
                <ul>
                    ${chainsArray.join(' ')}
                </ul>
            </li>
        `)
    }

    document.querySelector('#net-worth-container').style.display = 'block'
    document.querySelector('#net-worth').innerHTML = totalUSD.toFixed(3)
}

const getPositions = async wallet => {
    console.log('getting positions')
    const res = await fetch(`/positions/${wallet}`)
    const positionsReceived = await res.json()
    let html = ''

    console.log('positions received', positionsReceived)

    if (positionsReceived.length == 0) {
        html = "You don't have any positions right now"
    } else {
        html = positionsReceived.map(pos => {
            return `<li class="position asset">${pos.protocol}: ${pos.total.toFixed(5)}</li>`
        }).join('')
    }

    document.querySelector('#staking-positions-title').style.display = 'inherit'
    document.querySelector('#staking-positions').style.display = 'inherit'
    document.querySelector('#staking-positions').innerHTML = html
}

window.addEventListener('load', () => {
    setupWallet()
})

document.querySelectorAll('.defi-buttons button').forEach(button => {
    button.addEventListener('click', e => {
        [...document.querySelectorAll('.defi-buttons button')].map(b => b.className = '')
        e.target.className = 'selected'

        switch (e.target.dataset.defi) {
            case 'dashboard':
                document.querySelector('.dashboard-page').style.display = 'inherit'
                document.querySelector('.opportunities-page').style.display = 'none'
                break
            case 'opportunities':
                document.querySelector('.dashboard-page').style.display = 'none'
                document.querySelector('.opportunities-page').style.display = 'inherit'
                break
        }
    })
})