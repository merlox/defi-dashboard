import { chain, configureChains, createClient } from '@wagmi/core'
import { ClientCtrl, ConfigCtrl } from '@web3modal/core'
import { EthereumClient, modalConnectors, walletConnectProvider } from '@web3modal/ethereum'

const setWallet = async () => {
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

    ethereumClient.watchAccount(change => {
        document.querySelector('#wallet').innerHTML = change.address || ''  
    })

    // 5. Import ui package after all configuration has been completed
    await import('@web3modal/ui')
}

window.addEventListener('load', async () => {
    setWallet()

    console.log('getting assets')
    let res = await fetch('/asset-balances')
    res = await res.json()
    console.log('assets received')

    for (let i = 0; i < res.length; i++) {
        const chains = res[i].asset.chains.map(item => `
            <li>
                ${res[i].asset.name + ' on ' + item.chain}: ${item.balance}
            </li>
        `)
        document.querySelector('#asset-container').insertAdjacentHTML('beforeend', `
            <li class="asset">
                <b>${res[i].asset.name}</b>
                <ul>
                    ${chains}
                </ul>
            </li>
        `)
    }

    document.querySelector('#loading-assets').style.display = 'none'
})
