document.write('<script type="text/vbscript">\n\
Function BinFileReaderImpl_IE_VBAjaxLoader(fileName)\n\
    Dim xhr\n\
    Set xhr = CreateObject("Microsoft.XMLHTTP")\n\
\n\
    xhr.Open "GET", fileName, False\n\
\n\
    xhr.setRequestHeader "Accept-Charset", "x-user-defined"\n\
    xhr.send\n\
\n\
    Dim byteArray()\n\
\n\
    if xhr.Status = 200 Then\n\
        Dim byteString\n\
        Dim i\n\
\n\
        byteString=xhr.responseBody\n\
\n\
        ReDim byteArray(LenB(byteString))\n\
\n\
        For i = 1 To LenB(byteString)\n\
            byteArray(i-1) = AscB(MidB(byteString, i, 1))\n\
        Next\n\
    End If\n\
\n\
    BinFileReaderImpl_IE_VBAjaxLoader=byteArray\n\
End Function\n\
</script>');
