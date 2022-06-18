import './App.css';
import { useEffect, useState } from 'react';
import styled from 'styled-components';


const width = '10px';
const height = '50px'

function App() {

  const matrix = 9;

  const [lines, setLines] = useState({});
  const [boxes, setBoxes] = useState([]);
  const [player, setPlayer] = useState('red');

  useEffect(() => {
    startGame();
  }, [])

  useEffect(() => {
    checkWinner();
  }, [boxes])

  const checkWinner = () => {
    const total = boxes.length;
    const red = boxes.filter(box => box.player === 'red').length;
    const blue = boxes.filter(box => box.player === 'blue').length;
    if (red > blue && red > total / 2) alert('red wins')
    if (blue > red && blue > total / 2) alert('blue wins')
  }

  const startGame = () => {
    const lines = getLines();
    setLines(lines)
    createBoxes(lines);
  }

  const handleLineClick = (line) => {
    setLines({
      ...lines,
      [line.row + ',' + line.column]:
      {
        ...lines[line.row + ',' + line.column],
        isSelected: true,
        player: player
      }
    })

    setBoxes(boxes.map(box => {
      const isExist = box.lines.some(boxline => boxline === line.row + ',' + line.column);
      if (isExist) {
        if (box.count + 1 === 4) {
          return { ...box, count: box.count + 1, player: player }
        } else {
          return { ...box, count: box.count + 1 }
        }
      }
      return box;
    }))

  }

  const createBoxes = (lines) => {
    const box = [];
    Object.values(lines).forEach((line) => {
      if (line.row % 2 === 0 && line.row !== ((matrix * 2) - 2)) {
        box.push({
          lines: [
            line.row + ',' + line.column,
            (line.row + 1) + ',' + line.column,
            (line.row + 2) + ',' + line.column,
            (line.row + 1) + ',' + (line.column + 1),
          ],
          count: 0,
          player: null
        })
      }
    })
    setBoxes(box);
  }

  const getLines = () => {
    const obj = {}
    for (let i = 0; i < (matrix * 2) - 1; i++) {
      let limit = i % 2 === 0 ? matrix - 1 : matrix;
      for (let j = 0; j < limit; j++) {
        obj[i + ',' + j] = {
          id: Math.random(),
          row: i,
          column: j,
          isSelected: false,
          player: null
        }
      }
    }
    return obj;
  }

  const getLine = (line) => {
    if (line.row % 2 !== 0) {
      return (
        <VerticalLine
          selected={line.isSelected}
          color={line.player}
          onClick={() => handleLineClick(line)}></VerticalLine>
      )
    } else {
      return (
        <>
          <Point />
          <HorizontalLine
            selected={line.isSelected}
            color={line.player}
            onClick={() => handleLineClick(line)}>
          </HorizontalLine>
          {line.column === (matrix - 2) && <Point />}
        </>
      )
    }
  }

  const getBreak = (line) => {
    if (line.row % 2 !== 0) {
      return line.column === (matrix - 1) && <br />;
    } else {
      return line.column === (matrix - 2) && <br />;
    }
  }


  return (
    <div className="App">
      {player}
      <Container>
        <LineContiner>
          {
            Object.values(lines).map((line, index) => (
              <>
                {getLine(line)}
                {getBreak(line, index)}
              </>
            ))
          }
        </LineContiner>
        <BoxContiner>
          {
            boxes.map((box, index) => (
              <>
                <Box key={index} color={box.player}></Box>
                {(index + 1) % (matrix - 1) === 0 && <br />}
              </>
            ))
          }
        </BoxContiner>
      </Container>
    </div>
  );
}

export default App;


const Line = styled.li`
  background: #dadada;
  display:inline-flex;
  cursor: pointer;
  font-size: 0;
  &: hover{
    background: grey;
  }
`

const VerticalLine = styled(Line)`
  width:${width};
  height: ${height};
  margin-right:${height};
  ${props => props.selected && `background: ${props.color};`}
`

const HorizontalLine = styled(Line)`
  height: ${width};
  width: ${height};
  ${props => props.selected && `background: ${props.color};`}
`

const Point = styled.li`
  background: black;
  display:inline-flex;
  font-size: 0;
  height: ${width};
  width:${width};
`

const Box = styled.li`
  background:${props => props.color === null ? '#f3f4f7' : props.color};
  display:inline-block;
  height: ${height};
  width: ${height};
  opacity: 0.6;
  margin-left: ${width};
  margin-top:  ${width};
`

const LineContiner = styled.ul`
  font-size: 0;
  position: absolute;
  z-index:1;
`

const BoxContiner = styled.ul`
  font-size: 0;
  position: absolute;
`

const Container = styled.div`
  position: relative;
`
