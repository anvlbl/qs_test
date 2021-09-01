const onlyDigits = (str) => {
    const regex = /^\d+$/;
    return regex.test(str);
}

export { onlyDigits };