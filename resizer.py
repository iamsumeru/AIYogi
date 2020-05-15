
import glob
import cv2 as cv


path = glob.glob('C:/Users/User/Downloads/posenet-python-master/custom_images/*.jpg')
cv_img = []
cv_img_out= []
for img in path:
    n = cv.imread(img)
    cv_img.append(n)
    
index=0
    
for img in cv_img:
        #img = cv2.imread(index, cv2.IMREAD_UNCHANGED)
        index += 1
        print('Original Dimensions : ',img.shape)
         
        scale_percent =30 # percent of original size
        width = int(img.shape[1] * scale_percent / 100)
        height = int(img.shape[0] * scale_percent / 100)
        dim = (width, height)
        # resize image
        resized = cv.resize(img, dim, interpolation = cv.INTER_AREA)
        print('Resized Dimensions : ',resized.shape)
        cv.imwrite('C:/Users/User/Downloads/posenet-python-master/custom_images/tempoutput/'+"name"+str(index)+".jpg", resized) 
       