
import { useState } from 'react'
import HomeLogo from '../../components/HomeLogo/HomeLogo';
import styles from './Home.module.css'
export default function Home() {
    const [open, setOpen] = useState(true);
    const Good = ({ open }) => {
        let holder;
        // console.log(open)
        if (open) {
            holder = <div>
                Great work
            </div>
        }
        else {
            holder = <div>
                bad work
            </div>
        }
        return holder;
    }

    return <div className={styles.container}>
        {/* <h1>Welcome</h1>
        <Good open={open} /> */}
        <HomeLogo />
    </div>
}