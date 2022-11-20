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
            await getAssets(change.address)
            document.querySelector('#connect-message').style.display = 'none'
            document.querySelector('#loading-assets').style.display = 'none'
        } else {
            document.querySelector('#connect-message').style.display = 'inherit'
            document.querySelector('#loading-assets').style.display = 'none'
            document.querySelector('#asset-container').innerHTML = ''
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

    for (let i = 0; i < res.length; i++) {
        const chains = res[i].asset.chains.map(item => `
            <li>
                ${item.chain}: ${item.balance} ${res[i].asset.symbol}
            </li>
        `)
        document.querySelector('#asset-container').insertAdjacentHTML('beforeend', `
            <li class="asset">
                <b>${res[i].asset.symbol}</b>
                <ul>
                    ${chains}
                </ul>
            </li>
        `)
    }
}

window.addEventListener('load', () => {
    setupWallet()
})