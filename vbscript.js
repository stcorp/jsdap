if (IE_HACK) document.write('<script type="text/vbscript">\n\
    Function BinaryToString(Binary)\n\
        Dim I,S\n\
        For I = 1 to LenB(Binary)\n\
            S = S & Chr(AscB(MidB(Binary,I,1)))\n\
        Next\n\
        BinaryToString = S\n\
    End Function\n\
</script>');
