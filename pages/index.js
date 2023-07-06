import { useAddress, useDisconnect, useMetamask} from '@thirdweb-dev/react';
// import {ThirdwebSDK} from "@thirdweb-dev/react"
import { ThirdwebSDK } from "@thirdweb-dev/sdk"
import * as cookie from 'cookie'


export default function Home() {
    const address = useAddress();
    const connectWithMetamask = useMetamask()
    const disconnectWallet = useDisconnect();

    return (
        <div>
            <p>Welcome to the Restricted Area</p>
            <button>logout</button>
        </div>
    )
}


export async function getServerSideProps(context) {
    // CHECK IF THE AUTHENTICATION COOKIE IS PRESENT
    const parsedCookies = cookie?.parse(context?.req?.headers?.cookie || "");
    const authToken = parsedCookies?.["access_token"];
    // if no authentication token, then redirect user to the login page
    if (!authToken) {
        return {
            redirect: {
                destination: "/login",
                permanent: false
            }
        }
    }

    // NOW THAT I KNOW AN AUTH TOKEN IS HELD, CHECK IF IT IS FROM A VALID SOURCE by checking domain name
    const PRIVATE_KEY = process.env.PRIVATE_KEY
    // instantiate the thirdweb SDK
    const sdk = ThirdwebSDK.fromPrivateKey(PRIVATE_KEY, "mumbai")
    // authenticate token
    const domain = "thirdweb.com"
    const address = sdk.auth.authenticate(domain, authToken)

    let validToken;
    // if authentication token is invalid, then redirect user to the login page
    if (!address) {
        return {
            redirect: {
                destination: "/login",
                permanent: false
            }
        }
    } else {
        validToken = address
    }

    // CHECK IF USER HOLDS AN ACCESS NFT
    async function checkBalance(sdk, validToken) {
        const editionDropContract = sdk.getEditionDrop("0x76141bCD9fc123366C5D86F6228BAC13Bc2Db099");
        const balance = await editionDropContract.balanceOf(address, 0);
        //
        return balance.gt(0);
    }
    //
    const authenticatedWallet = await checkBalance(sdk, address);
    // if user does not own authentication NFT, then redirect to the login page
    if (!authenticatedWallet) {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            }
        }
    }

    //
    return {
        props: {}
    }
}