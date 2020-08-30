import fs from 'fs'
import path, { parse } from 'path'
import { promisify } from 'util'

const readdir = promisify(fs.readdir);

import Link from 'next/link';

export default function Index({ wpms, files }) {
  console.log("WPMs:", wpms)
  return (
    <div>
      <h1>📰  Morse Code News 📰 </h1>
      <h2>Last Update: {new Date(files[0].date).toUTCString().replace(" GMT", "Z")}</h2>
      <h3>Select your speed</h3>
      <ul>
        {wpms.map((wpm) => (
          <li className='centered'>
            <Link href='/[wpm]' as={`/${wpm}`}>
              <a> {wpm} WPM </a>
            </Link>
          </li>
        ))}
      </ul>
      <h6> Source: <a href="https://github.com/mdp/morse_code_news">https://github.com/mdp/morse_code_news</a> </h6>
    </div>
  );
}


function parseFilename(filename) {
  const parts = filename.split("-")
  const name = parts[0].replace("_", " ")
  const repeat = parts[1]
  const speed = parts[2]
  const [wpm, fwpm] = speed.split("x")
  const date = Date.now(parts[3])
  return {
    name,
    wpm,
    repeat,
    fwpm,
    date,
    file: filename,
  }
}

export async function getStaticProps(context) {
  const files = await readdir('./public')

  const mp3s = files.filter(function(file) {
    return path.extname(file).toLowerCase() === '.mp3';
  }).map(parseFilename);
  const reducer = (accumulator, currentValue) => {
    if (accumulator.indexOf(currentValue.fwpm) < 0) {
      accumulator.push(currentValue.fwpm)
    }
    return accumulator
  }
  let wpms = mp3s.reduce(reducer, [])

  console.log(wpms)
  return {
    props: {
      wpms,
      files: mp3s,
    },
  }
}
