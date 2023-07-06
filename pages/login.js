import { useAddress, useMetamask, useSDK } from "@thirdweb-dev/react";
import { ThirdwebSDK } from '@thirdweb-dev/auth'


export default function Login() {
    const address = useAddress();
    const connectWithMetamask = useMetamask();
    const sdk = useSDK();
    console.log("sdk")
    console.log(sdk)
    const editionDropContract = useEditionDrop(process.env.EDITION_DROP_CONTRACT_ADDRESS);

    const {mutate, isLoading} = useClaimNFT(editionDropContract);

    async function signIn(){
        const domain = "thirdweb.com";
        const payload = await sdk.auth.login(domain);
        window.location = `/api/login?payload=${JSON.stringify(payload)}`
    }
}