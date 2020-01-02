  // delete unknown word from vocabulary
  export function useDeleteWordFromVocabulary(word) {
    const [wordToDelete, setWordToDelete] = useState(word);
    
    useEffect(() => {
      if(!wordToDelete)
        return;
      const deleteWordFromVocabulary = async () => {
        try {
          await API.graphql(graphqlOperation(DELETE_WORD_FROM_VOCABULARY, {
            word: wordToDelete
          }));
          setVocabulary(vocabulary => vocabulary.filter(word => word !== wordToDelete));
          console.log("Word was deleted!!!");
        } catch (ex) {
          console.log(ex);
        }
      };
      deleteWordFromVocabulary();
    }, [wordToDelete]);

    return wordDeleted;

  }
