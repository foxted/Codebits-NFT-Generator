const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');
const {
    width,
    height,
    description,
    baseImageUri,
    series,
    seriesBackgroundColor,
    seriesSignatureColor,
    variants,
    baseLayer,
    layers,
} = require('./input/config.js');
const console = require('console');
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');
let metadataList = [];
let attributesList = [];
let dnaList = [];

const saveImage = (dna) => {
    fs.writeFileSync(
        `./output/${dna}.png`,
        canvas.toBuffer('image/png'),
    );
};

const signImage = (dna) => {
    ctx.fillStyle = seriesSignatureColor;
    ctx.font = 'bold 30pt Verdana';
    ctx.textBaseline = 'bottom';
    ctx.textAlign = 'center';
    ctx.fillText(dna, canvas.width / 2, canvas.height / 2 + 20);
};

const addMetadata = (dna) => {
    let dateTime = Date.now();
    let tempMetadata = {
        dna: dna,
        name: `#${dna}`,
        description: description,
        image: `${baseImageUri}/${dna}.png`,
        date: dateTime,
        attributes: attributesList,
    };
    metadataList.push(tempMetadata);
    attributesList = [];
};

const addAttributes = (_element) => {
    let selectedElement = _element.layer.selectedElement;
    attributesList.push({
        trait_type: _element.layer.name,
        value: selectedElement.name,
    });
};

const loadLayerImage = async (_layer) => {
    return new Promise(async (resolve) => {
        const image = await loadImage(`${_layer.selectedElement.path}`);
        resolve({ layer: _layer, loadedImage: image });
    });
};

const drawElement = (_element) => {
    ctx.drawImage(
        _element.loadedImage,
        _element.layer.position.x,
        _element.layer.position.y,
        _element.layer.size.width,
        _element.layer.size.height,
    );
    addAttributes(_element);
};

const writeMetaData = (_data) => {
    fs.writeFileSync('./output/_metadata.json', _data);
};

const saveMetaDataSingleFile = (dna) => {
    fs.writeFileSync(
        `./output/${dna}.json`,
        JSON.stringify(metadataList.find((meta) => meta.dna == dna)),
    );
};

const mapLayersFromDNA = (dna = []) => {
    return layers.map((layer, index) => {
        let selectedElement = layer.elements.find((e) => e.id === dna[index].code);

        return {
            name: layer.name,
            position: layer.position,
            size: layer.size,
            selectedElement: selectedElement
        }
    });
};

const generatePermutations = ( n, arr, len, L) => {
    // Sequence is of length L
    let permutation = [];

    for (let i = 0; i < L; i++) {
        // Print the ith element
        // of sequence
        permutation.push(arr[n % len]);
        n = parseInt(n / len);
    }

    return permutation;
}

// Find all the permutations
const sequencing = (L, arr, len) => {
    let permutations = [];

    // There can be (len)^L permutations
    for (let i = 0; i < parseInt(Math.pow(len, L)); i++) {
        // Convert i to len th base
        permutations.push(generatePermutations(i, arr, len, L));
    }

    return permutations;
}

const startCreating = async () => {
    writeMetaData('');

    const permutations = sequencing(layers.length, variants, variants.length);

    for(let i = 0 ; i < permutations.length ; i++) {
        let dna = permutations[i];
        let name = `${series}-${dna.map((layer) => layer.code).join('')}`;
        let results = mapLayersFromDNA(dna);
        let loadedElements = [
            loadLayerImage(baseLayer)
        ];

        results.forEach((layer) => {
            loadedElements.push(loadLayerImage(layer));
        });

        await Promise.all(loadedElements).then((elementArray) => {
            ctx.beginPath();
            ctx.rect(0, 0, width, height);
            ctx.fillStyle = seriesBackgroundColor;
            ctx.fillRect(0, 0, width, height);
            elementArray.forEach((element) => {
                drawElement(element);
            });
            signImage(`#${name}`);
            saveImage(name);
            addMetadata(name);
            saveMetaDataSingleFile(name);
            console.log(
                `Created DNA: ${name}`
            );
        });
    }

    writeMetaData(JSON.stringify(metadataList));
};

startCreating();
