const generateSeats = () => {
    const rows = 6;
    const seatsPerRow = 8;
    let rowArray = [];
    let seatNumber = 1;

    for (let i = 0; i < rows; i++) {
        let columnArray = [];
        for (let j = 0; j < seatsPerRow; j++) {
            let seatObject = {
                number: seatNumber,
                taken: Boolean(Math.round(Math.random())),
                selected: false,
            };
            columnArray.push(seatObject);
            seatNumber++;
        }
        rowArray.push(columnArray);
    }
    return rowArray;
};


const [twoDSeatArray, setTwoDSeatArray] = useState(generateSeats());
const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
    

const selectSeat = (index: number, subindex: number, num: number) => {
    if (!twoDSeatArray[index][subindex].taken) {
        let temp = [...twoDSeatArray];

        if (selectedSeat !== null) {
            temp = temp.map(row =>
                row.map(seat => ({...seat, selected: false}))
            );
        }
        temp[index][subindex].selected = !temp[index][subindex].selected;
        setSelectedSeat(temp[index][subindex].selected ? num : null);
        setPrice(100);
        setTwoDSeatArray(temp);
    }
};

const BookSeats = () => {
    if (selectedSeat === null) {
        Alert.alert('Selection Required', 'Please select a seat before proceeding.');
        return;
    }

    const rowIndex = Math.floor((selectedSeat - 1) / 8);
    const rowLetter = String.fromCharCode(65 + rowIndex);
    const seatInRow = selectedSeat % 8 || 8;
    console.log(selectedSeat)
    navigation.navigate('TicketPage', {
        seatArray: [selectedSeat],
        ticketImage: route.params.movie.poster_url,
        movieData: route.params.movie,
        seatDetails: {
            hall: "02",
            row: rowLetter,
            seatNumber: seatInRow,
            rawSeatNumber: selectedSeat
        },
        price:price,
    });
};


