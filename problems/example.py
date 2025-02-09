def bubble_sort(arr):
    """
    버블 정렬 구현
    입력: 정수 리스트
    출력: 정렬된 리스트
    """
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr

# 테스트
if __name__ == "__main__":
    test_array = [64, 34, 25, 12, 22, 11, 90]
    sorted_array = bubble_sort(test_array)
    print("정렬된 배열:", sorted_array) 